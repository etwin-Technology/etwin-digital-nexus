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
        $stmt = $db->prepare("SELECT * FROM digital_products WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) {
            http_response_code(404);
            echo json_encode(["error" => "Digital product not found"]);
            exit;
        }
        $row["features"]  = json_decode($row["features"] ?? "[]", true);
        $row["price"]     = (float) $row["price"];
        $row["old_price"] = $row["old_price"] !== null ? (float) $row["old_price"] : null;
        $row["rating"]    = (float) $row["rating"];
        $row["sales"]     = (int) $row["sales"];
        echo json_encode($row);
    } else {
        $stmt = $db->query("SELECT * FROM digital_products ORDER BY sales DESC");
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) {
            $r["features"]  = json_decode($r["features"] ?? "[]", true);
            $r["price"]     = (float) $r["price"];
            $r["old_price"] = $r["old_price"] !== null ? (float) $r["old_price"] : null;
            $r["rating"]    = (float) $r["rating"];
            $r["sales"]     = (int) $r["sales"];
        }
        echo json_encode($rows);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
