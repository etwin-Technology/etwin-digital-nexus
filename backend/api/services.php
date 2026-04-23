<?php
require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../config/auth.php";

$db     = (new Database())->connect();
$method = $_SERVER["REQUEST_METHOD"];
$id     = $_GET["id"] ?? null;

function hydrate_service(array $r): array {
    $r["features"] = json_decode($r["features"] ?? "[]", true);
    return $r;
}

try {
    if ($method === "GET") {
        if ($id) {
            $stmt = $db->prepare("SELECT * FROM services WHERE id = ?");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            if (!$row) { http_response_code(404); echo json_encode(["error" => "Not found"]); exit; }
            echo json_encode(hydrate_service($row));
        } else {
            $stmt = $db->query("SELECT * FROM services ORDER BY created_at ASC");
            echo json_encode(array_map("hydrate_service", $stmt->fetchAll()));
        }
        exit;
    }

    require_admin();
    $body = json_decode(file_get_contents("php://input"), true) ?? [];

    if ($method === "POST") {
        $newId = trim($body["id"] ?? "");
        if ($newId === "") { http_response_code(400); echo json_encode(["error" => "id required"]); exit; }
        $stmt = $db->prepare("
            INSERT INTO services (id, title, icon, description, features)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $newId,
            (string) ($body["title"] ?? ""),
            (string) ($body["icon"] ?? "Sparkles"),
            (string) ($body["description"] ?? ""),
            json_encode($body["features"] ?? []),
        ]);
        http_response_code(201);
        echo json_encode(["success" => true, "id" => $newId]);
        exit;
    }

    if ($method === "PUT") {
        if (!$id) { http_response_code(400); echo json_encode(["error" => "id required"]); exit; }
        $stmt = $db->prepare("
            UPDATE services SET title=?, icon=?, description=?, features=? WHERE id=?
        ");
        $stmt->execute([
            (string) ($body["title"] ?? ""),
            (string) ($body["icon"] ?? "Sparkles"),
            (string) ($body["description"] ?? ""),
            json_encode($body["features"] ?? []),
            $id,
        ]);
        echo json_encode(["success" => true]);
        exit;
    }

    if ($method === "DELETE") {
        if (!$id) { http_response_code(400); echo json_encode(["error" => "id required"]); exit; }
        $stmt = $db->prepare("DELETE FROM services WHERE id = ?");
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
