<?php
require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../config/auth.php";

$db     = (new Database())->connect();
$method = $_SERVER["REQUEST_METHOD"];
$id     = $_GET["id"] ?? null;

try {
    require_admin();

    if ($method === "GET") {
        $stmt = $db->query("SELECT * FROM service_requests ORDER BY created_at DESC");
        echo json_encode($stmt->fetchAll());
        exit;
    }

    if ($method === "PUT") {
        if (!$id) { http_response_code(400); echo json_encode(["error" => "id required"]); exit; }
        $body = json_decode(file_get_contents("php://input"), true) ?? [];
        $stmt = $db->prepare("UPDATE service_requests SET is_read = ? WHERE id = ?");
        $stmt->execute([(int) ($body["is_read"] ?? 1), $id]);
        echo json_encode(["success" => true]);
        exit;
    }

    if ($method === "DELETE") {
        if (!$id) { http_response_code(400); echo json_encode(["error" => "id required"]); exit; }
        $stmt = $db->prepare("DELETE FROM service_requests WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
        exit;
    }

    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
