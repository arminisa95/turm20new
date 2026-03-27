<?php
/**
 * Turm20 Admin API for World4You Hosting
 * Handles file uploads, content management via MySQL
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Configuration - UPDATE THESE
$config = [
    'upload_secret' => 'Limbic3000',  // Admin Panel Login Passwort
    'upload_dir' => 'uploads/videos/',  // Relative to webroot
    'max_upload_size' => 500 * 1024 * 1024,  // 500MB
    'allowed_extensions' => ['mp4', 'webm', 'ogg', 'mov'],
    'db_host' => 'mysqlsvr75.world4you.com',
    'db_name' => '6923870db5',
    'db_user' => 'sql4460592',
    'db_pass' => 'xr+3bg03'
];

// Create upload directory if not exists
if (!file_exists($config['upload_dir'])) {
    mkdir($config['upload_dir'], 0755, true);
}

$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'upload':
            handleUpload($config);
            break;
        case 'get_content':
            handleGetContent($config);
            break;
        case 'save_content':
            handleSaveContent($config);
            break;
        case 'delete_video':
            handleDeleteVideo($config);
            break;
        default:
            jsonResponse(['success' => false, 'error' => 'Unknown action']);
    }
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()]);
}

/**
 * Handle file upload to server
 */
function handleUpload($config) {
    // Check auth
    $auth = getBearerToken();
    if ($auth !== $config['upload_secret']) {
        http_response_code(401);
        jsonResponse(['success' => false, 'error' => 'Unauthorized']);
    }

    if (!isset($_FILES['file'])) {
        jsonResponse(['success' => false, 'error' => 'No file provided']);
    }

    $file = $_FILES['file'];
    
    // Check errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        jsonResponse(['success' => false, 'error' => 'Upload error: ' . $file['error']]);
    }

    // Check size
    if ($file['size'] > $config['max_upload_size']) {
        jsonResponse(['success' => false, 'error' => 'File too large (max 500MB)']);
    }

    // Check extension
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $config['allowed_extensions'])) {
        jsonResponse(['success' => false, 'error' => 'Invalid file type. Allowed: ' . implode(', ', $config['allowed_extensions'])]);
    }

    // Generate safe filename
    $safeName = time() . '_' . preg_replace('/[^a-zA-Z0-9.-]/', '_', $file['name']);
    $destPath = $config['upload_dir'] . $safeName;

    // Move file
    if (!move_uploaded_file($file['tmp_name'], $destPath)) {
        jsonResponse(['success' => false, 'error' => 'Failed to save file']);
    }

    // Build public URL
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $url = $protocol . '://' . $host . '/' . $destPath;

    jsonResponse([
        'success' => true,
        'url' => $url,
        'filename' => $safeName,
        'size' => $file['size']
    ]);
}

/**
 * Get all content (termine, programs, videos) from database
 */
function handleGetContent($config) {
    $pdo = getDB($config);
    
    $content = [
        'termine' => [],
        'programs' => [],
        'videos' => ['hero' => null, 'grid' => []]
    ];

    // Get termine
    $stmt = $pdo->query("SELECT * FROM termine ORDER BY date ASC");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $content['termine'][] = [
            'id' => $row['id'],
            'day' => $row['day_name'],
            'date' => $row['date_str'],
            'title' => $row['title'],
            'ticketUrl' => $row['ticket_url'],
            'soldOut' => (bool)$row['sold_out']
        ];
    }

    // Get programs
    $stmt = $pdo->query("SELECT * FROM programs ORDER BY id ASC");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $content['programs'][] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'subtitle' => $row['subtitle'],
            'url' => $row['url']
        ];
    }

    // Get hero video
    $stmt = $pdo->query("SELECT * FROM videos WHERE is_hero = 1 LIMIT 1");
    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $content['videos']['hero'] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'subtitle' => $row['subtitle'],
            'url' => $row['url']
        ];
    }

    // Get grid videos
    $stmt = $pdo->query("SELECT * FROM videos WHERE is_hero = 0 ORDER BY sort_order ASC");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $content['videos']['grid'][] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'url' => $row['url']
        ];
    }

    jsonResponse(['success' => true, 'content' => $content]);
}

/**
 * Save content to database
 */
function handleSaveContent($config) {
    // Check auth
    $auth = getBearerToken();
    if ($auth !== $config['upload_secret']) {
        http_response_code(401);
        jsonResponse(['success' => false, 'error' => 'Unauthorized']);
    }

    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        jsonResponse(['success' => false, 'error' => 'Invalid JSON']);
    }

    $pdo = getDB($config);
    $pdo->beginTransaction();

    try {
        // Save termine
        if (isset($input['termine'])) {
            $pdo->exec("DELETE FROM termine");
            $stmt = $pdo->prepare("INSERT INTO termine (id, day_name, date_str, title, ticket_url, sold_out) VALUES (?, ?, ?, ?, ?, ?)");
            foreach ($input['termine'] as $t) {
                $stmt->execute([
                    $t['id'], $t['day'], $t['date'], $t['title'], $t['ticketUrl'], $t['soldOut'] ? 1 : 0
                ]);
            }
        }

        // Save programs
        if (isset($input['programs'])) {
            $pdo->exec("DELETE FROM programs");
            $stmt = $pdo->prepare("INSERT INTO programs (id, title, subtitle, url) VALUES (?, ?, ?, ?)");
            foreach ($input['programs'] as $p) {
                $stmt->execute([$p['id'], $p['title'], $p['subtitle'], $p['url']]);
            }
        }

        // Save videos
        if (isset($input['videos'])) {
            $pdo->exec("DELETE FROM videos");
            
            // Hero video
            if (!empty($input['videos']['hero'])) {
                $h = $input['videos']['hero'];
                $stmt = $pdo->prepare("INSERT INTO videos (id, title, subtitle, url, is_hero, sort_order) VALUES (?, ?, ?, ?, 1, 0)");
                $stmt->execute([$h['id'], $h['title'], $h['subtitle'], $h['url']]);
            }

            // Grid videos
            $stmt = $pdo->prepare("INSERT INTO videos (id, title, url, is_hero, sort_order) VALUES (?, ?, ?, 0, ?)");
            foreach ($input['videos']['grid'] as $i => $v) {
                $stmt->execute([$v['id'], $v['title'], $v['url'], $i]);
            }
        }

        $pdo->commit();
        jsonResponse(['success' => true, 'message' => 'Content saved']);
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
}

/**
 * Delete video file and database entry
 */
function handleDeleteVideo($config) {
    $auth = getBearerToken();
    if ($auth !== $config['upload_secret']) {
        http_response_code(401);
        jsonResponse(['success' => false, 'error' => 'Unauthorized']);
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? '';
    
    if (!$id) {
        jsonResponse(['success' => false, 'error' => 'No video ID provided']);
    }

    $pdo = getDB($config);
    
    // Get file URL
    $stmt = $pdo->prepare("SELECT url FROM videos WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($row) {
        // Delete file if local
        $filename = basename($row['url']);
        $filepath = $config['upload_dir'] . $filename;
        if (file_exists($filepath)) {
            unlink($filepath);
        }
        
        // Delete from DB
        $stmt = $pdo->prepare("DELETE FROM videos WHERE id = ?");
        $stmt->execute([$id]);
    }

    jsonResponse(['success' => true]);
}

/**
 * Get database connection
 */
function getDB($config) {
    static $pdo;
    if (!$pdo) {
        $dsn = "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4";
        $pdo = new PDO($dsn, $config['db_user'], $config['db_pass']);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    return $pdo;
}

/**
 * Get Bearer token from Authorization header
 */
function getBearerToken() {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? '';
    if (preg_match('/Bearer\s+(.*)$/i', $auth, $matches)) {
        return $matches[1];
    }
    return '';
}

/**
 * Send JSON response
 */
function jsonResponse($data) {
    echo json_encode($data);
    exit;
}
