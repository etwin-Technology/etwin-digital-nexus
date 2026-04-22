<?php
require_once __DIR__ . "/../config/database.php";

$db = (new Database())->connect();

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

try {
    $stmt = $db->query("SELECT * FROM services ORDER BY created_at ASC");
    $rows = $stmt->fetchAll();
    foreach ($rows as &$r) {
        $r["features"] = json_decode($r["features"] ?? "[]", true);
    }
    echo json_encode($rows);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
