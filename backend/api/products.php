<?php
require_once __DIR__ . "/../config/database.php";

$db = (new Database())->connect();
$method = $_SERVER["REQUEST_METHOD"];
$id = $_GET["id"] ?? null;

if ($method !== "GET") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

try {
    if ($id) {
        $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) {
            http_response_code(404);
            echo json_encode(["error" => "Product not found"]);
            exit;
        }
        $row["highlights"] = json_decode($row["highlights"] ?? "[]", true);
        $row["price"] = (float) $row["price"];
        echo json_encode($row);
    } else {
        $stmt = $db->query("SELECT * FROM products ORDER BY created_at DESC");
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) {
            $r["highlights"] = json_decode($r["highlights"] ?? "[]", true);
            $r["price"] = (float) $r["price"];
        }
        echo json_encode($rows);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
