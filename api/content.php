<?php
/**
 * Turm20 Content Loader for World4You
 * Fetches content from MySQL and outputs JSON for frontend
 */

header('Content-Type: application/json');
header('Cache-Control: no-cache, must-revalidate');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Database config - UPDATE THESE
$dbConfig = [
    'host' => 'mysqlsvr75.world4you.com',
    'name' => '6923870db5',
    'user' => 'sql4460592',
    'pass' => 'xr+3bg03'
];

try {
    $dsn = "mysql:host={$dbConfig['host']};dbname={$dbConfig['name']};charset=utf8mb4";
    $pdo = new PDO($dsn, $dbConfig['user'], $dbConfig['pass']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $content = [
        'termine' => [],
        'programs' => [],
        'videos' => ['hero' => null, 'grid' => []]
    ];

    // Get termine
    $stmt = $pdo->query("SELECT * FROM termine ORDER BY date_str ASC");
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

    echo json_encode($content);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
