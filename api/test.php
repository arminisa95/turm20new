<?php
// Test if database connection works
header('Content-Type: application/json');

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
    
    // Check tables
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    
    // Check data
    $counts = [];
    foreach ($tables as $table) {
        $count = $pdo->query("SELECT COUNT(*) FROM $table")->fetchColumn();
        $counts[$table] = $count;
    }
    
    echo json_encode([
        'success' => true,
        'database_connected' => true,
        'tables' => $tables,
        'row_counts' => $counts
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
