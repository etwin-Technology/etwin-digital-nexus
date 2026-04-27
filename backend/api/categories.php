<?php
require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../config/auth.php";

$db     = (new Database())->connect();
$method = $_SERVER["REQUEST_METHOD"];
$id     = $_GET["id"] ?? null;

try {
    if ($method === "GET") {
        if ($id) {
            $stmt = $db->prepare("SELECT * FROM categories WHERE id = ? OR slug = ?");
            $stmt->execute([$id, $id]);
            $row = $stmt->fetch();
            if (!$row) { http_response_code(404); echo json_encode(["error" => "Category not found"]); exit; }
            echo json_encode($row);
        } else {
            $stmt = $db->query("
                SELECT c.*, COUNT(p.id) AS product_count
                FROM categories c
                LEFT JOIN products p ON p.category_id = c.id
                GROUP BY c.id
                ORDER BY c.sort_order ASC, c.name ASC
            ");
            echo json_encode($stmt->fetchAll());
        }
        exit;
    }

    require_admin();
    $body = json_decode(file_get_contents("php://input"), true) ?? [];

    if ($method === "POST") {
        $newId = trim($body["id"] ?? "");
        $name  = trim($body["name"] ?? "");
        $slug  = trim($body["slug"] ?? $newId);
        if ($newId === "" || $name === "") {
            http_response_code(400); echo json_encode(["error" => "id and name required"]); exit;
        }
        $stmt = $db->prepare("INSERT INTO categories (id, name, slug, icon, sort_order) VALUES (?,?,?,?,?)");
        $stmt->execute([
            $newId, $name, $slug,
            $body["icon"] ?? null,
            (int) ($body["sort_order"] ?? 0),
        ]);
        http_response_code(201);
        echo json_encode(["success" => true, "id" => $newId]);
        exit;
    }

    if ($method === "PUT") {
        if (!$id) { http_response_code(400); echo json_encode(["error" => "id required"]); exit; }
        $stmt = $db->prepare("UPDATE categories SET name=?, slug=?, icon=?, sort_order=? WHERE id=?");
        $stmt->execute([
            (string) ($body["name"] ?? ""),
            (string) ($body["slug"] ?? ""),
            $body["icon"] ?? null,
            (int) ($body["sort_order"] ?? 0),
            $id,
        ]);
        echo json_encode(["success" => true]);
        exit;
    }

    if ($method === "DELETE") {
        if (!$id) { http_response_code(400); echo json_encode(["error" => "id required"]); exit; }
        // Null out products' category_id first
        $db->prepare("UPDATE products SET category_id = NULL WHERE category_id = ?")->execute([$id]);
        $db->prepare("DELETE FROM categories WHERE id = ?")->execute([$id]);
        echo json_encode(["success" => true]);
        exit;
    }

    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
