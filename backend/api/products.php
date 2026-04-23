<?php
require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../config/auth.php";

$db     = (new Database())->connect();
$method = $_SERVER["REQUEST_METHOD"];
$id     = $_GET["id"] ?? null;

function hydrate_product(array $r): array {
    $r["highlights"] = json_decode($r["highlights"] ?? "[]", true);
    $r["price"]      = (float) $r["price"];
    $r["stock"]      = (int) ($r["stock"] ?? 0);
    return $r;
}

try {
    if ($method === "GET") {
        if ($id) {
            $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            if (!$row) { http_response_code(404); echo json_encode(["error" => "Product not found"]); exit; }
            echo json_encode(hydrate_product($row));
        } else {
            $stmt = $db->query("SELECT * FROM products ORDER BY created_at DESC");
            echo json_encode(array_map("hydrate_product", $stmt->fetchAll()));
        }
        exit;
    }

    // ====== Mutations require admin ======
    require_admin();

    $body = json_decode(file_get_contents("php://input"), true) ?? [];

    if ($method === "POST") {
        $newId = trim($body["id"] ?? "");
        $name  = trim($body["name"] ?? "");
        if ($newId === "" || $name === "") {
            http_response_code(400); echo json_encode(["error" => "id and name required"]); exit;
        }
        $stmt = $db->prepare("
            INSERT INTO products (id, name, price, category, image, description, highlights, stock)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $newId, $name,
            (float) ($body["price"] ?? 0),
            (string) ($body["category"] ?? "Accessories"),
            (string) ($body["image"] ?? ""),
            (string) ($body["description"] ?? ""),
            json_encode($body["highlights"] ?? []),
            (int) ($body["stock"] ?? 0),
        ]);
        http_response_code(201);
        echo json_encode(["success" => true, "id" => $newId]);
        exit;
    }

    if ($method === "PUT") {
        if (!$id) { http_response_code(400); echo json_encode(["error" => "id required"]); exit; }
        $stmt = $db->prepare("
            UPDATE products
            SET name=?, price=?, category=?, image=?, description=?, highlights=?, stock=?
            WHERE id=?
        ");
        $stmt->execute([
            (string) ($body["name"] ?? ""),
            (float) ($body["price"] ?? 0),
            (string) ($body["category"] ?? "Accessories"),
            (string) ($body["image"] ?? ""),
            (string) ($body["description"] ?? ""),
            json_encode($body["highlights"] ?? []),
            (int) ($body["stock"] ?? 0),
            $id,
        ]);
        echo json_encode(["success" => true]);
        exit;
    }

    if ($method === "DELETE") {
        if (!$id) { http_response_code(400); echo json_encode(["error" => "id required"]); exit; }
        $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
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
