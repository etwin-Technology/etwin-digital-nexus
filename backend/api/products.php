<?php
require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../config/auth.php";

$db     = (new Database())->connect();
$method = $_SERVER["REQUEST_METHOD"];
$id     = $_GET["id"] ?? null;

function hydrate_product(array $r): array {
    $r["highlights"] = json_decode($r["highlights"] ?? "[]", true) ?? [];
    $r["images"]     = json_decode($r["images"] ?? "[]", true) ?? [];
    $r["price"]      = (float) $r["price"];
    $r["stock"]      = (int) ($r["stock"] ?? 0);
    $r["featured"]   = (int) ($r["featured"] ?? 0) === 1;
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
            $where = [];
            $args  = [];
            if (!empty($_GET["category"])) {
                $where[] = "(category_id = ? OR category = ?)";
                $args[] = $_GET["category"];
                $args[] = $_GET["category"];
            }
            if (!empty($_GET["featured"])) {
                $where[] = "featured = 1";
            }
            $sql = "SELECT * FROM products"
                . ($where ? " WHERE " . implode(" AND ", $where) : "")
                . " ORDER BY featured DESC, created_at DESC";
            $stmt = $db->prepare($sql);
            $stmt->execute($args);
            echo json_encode(array_map("hydrate_product", $stmt->fetchAll()));
        }
        exit;
    }

    require_admin();
    $body = json_decode(file_get_contents("php://input"), true) ?? [];

    if ($method === "POST") {
        $newId = trim($body["id"] ?? "");
        $name  = trim($body["name"] ?? "");
        if ($newId === "" || $name === "") {
            http_response_code(400); echo json_encode(["error" => "id and name required"]); exit;
        }
        $stmt = $db->prepare("
            INSERT INTO products (id, name, price, category, category_id, image, images, description, highlights, stock, featured)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)
        ");
        $stmt->execute([
            $newId, $name,
            (float) ($body["price"] ?? 0),
            (string) ($body["category"] ?? "Accessories"),
            $body["category_id"] ?? null,
            (string) ($body["image"] ?? ""),
            json_encode($body["images"] ?? []),
            (string) ($body["description"] ?? ""),
            json_encode($body["highlights"] ?? []),
            (int) ($body["stock"] ?? 0),
            !empty($body["featured"]) ? 1 : 0,
        ]);
        http_response_code(201);
        echo json_encode(["success" => true, "id" => $newId]);
        exit;
    }

    if ($method === "PUT") {
        if (!$id) { http_response_code(400); echo json_encode(["error" => "id required"]); exit; }
        $stmt = $db->prepare("
            UPDATE products
            SET name=?, price=?, category=?, category_id=?, image=?, images=?, description=?, highlights=?, stock=?, featured=?
            WHERE id=?
        ");
        $stmt->execute([
            (string) ($body["name"] ?? ""),
            (float) ($body["price"] ?? 0),
            (string) ($body["category"] ?? "Accessories"),
            $body["category_id"] ?? null,
            (string) ($body["image"] ?? ""),
            json_encode($body["images"] ?? []),
            (string) ($body["description"] ?? ""),
            json_encode($body["highlights"] ?? []),
            (int) ($body["stock"] ?? 0),
            !empty($body["featured"]) ? 1 : 0,
            $id,
        ]);
        echo json_encode(["success" => true]);
        exit;
    }

    if ($method === "DELETE") {
        if (!$id) { http_response_code(400); echo json_encode(["error" => "id required"]); exit; }
        $db->prepare("DELETE FROM products WHERE id = ?")->execute([$id]);
        echo json_encode(["success" => true]);
        exit;
    }

    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
