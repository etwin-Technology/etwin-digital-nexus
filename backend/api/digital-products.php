<?php
require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../config/auth.php";

$db     = (new Database())->connect();
$method = $_SERVER["REQUEST_METHOD"];
$id     = $_GET["id"] ?? null;

function hydrate_dp(array $r): array {
    $r["features"]  = json_decode($r["features"] ?? "[]", true);
    $r["price"]     = (float) $r["price"];
    $r["old_price"] = $r["old_price"] !== null ? (float) $r["old_price"] : null;
    $r["rating"]    = (float) $r["rating"];
    $r["sales"]     = (int) $r["sales"];
    return $r;
}

try {
    if ($method === "GET") {
        if ($id) {
            $stmt = $db->prepare("SELECT * FROM digital_products WHERE id = ?");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            if (!$row) { http_response_code(404); echo json_encode(["error" => "Not found"]); exit; }
            echo json_encode(hydrate_dp($row));
        } else {
            $stmt = $db->query("SELECT * FROM digital_products ORDER BY sales DESC");
            echo json_encode(array_map("hydrate_dp", $stmt->fetchAll()));
        }
        exit;
    }

    require_admin();
    $body = json_decode(file_get_contents("php://input"), true) ?? [];

    if ($method === "POST") {
        $newId = trim($body["id"] ?? "");
        if ($newId === "") { http_response_code(400); echo json_encode(["error" => "id required"]); exit; }
        $stmt = $db->prepare("
            INSERT INTO digital_products
              (id, name, type, price, old_price, rating, sales, tagline, features, badge, download_url)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)
        ");
        $stmt->execute([
            $newId,
            (string) ($body["name"] ?? ""),
            (string) ($body["type"] ?? "Website Template"),
            (float)  ($body["price"] ?? 0),
            isset($body["old_price"]) && $body["old_price"] !== "" ? (float) $body["old_price"] : null,
            (float)  ($body["rating"] ?? 5),
            (int)    ($body["sales"] ?? 0),
            (string) ($body["tagline"] ?? ""),
            json_encode($body["features"] ?? []),
            $body["badge"] ?? null,
            $body["download_url"] ?? null,
        ]);
        http_response_code(201);
        echo json_encode(["success" => true, "id" => $newId]);
        exit;
    }

    if ($method === "PUT") {
        if (!$id) { http_response_code(400); echo json_encode(["error" => "id required"]); exit; }
        $stmt = $db->prepare("
            UPDATE digital_products
            SET name=?, type=?, price=?, old_price=?, rating=?, sales=?, tagline=?, features=?, badge=?, download_url=?
            WHERE id=?
        ");
        $stmt->execute([
            (string) ($body["name"] ?? ""),
            (string) ($body["type"] ?? "Website Template"),
            (float)  ($body["price"] ?? 0),
            isset($body["old_price"]) && $body["old_price"] !== "" ? (float) $body["old_price"] : null,
            (float)  ($body["rating"] ?? 5),
            (int)    ($body["sales"] ?? 0),
            (string) ($body["tagline"] ?? ""),
            json_encode($body["features"] ?? []),
            $body["badge"] ?? null,
            $body["download_url"] ?? null,
            $id,
        ]);
        echo json_encode(["success" => true]);
        exit;
    }

    if ($method === "DELETE") {
        if (!$id) { http_response_code(400); echo json_encode(["error" => "id required"]); exit; }
        $stmt = $db->prepare("DELETE FROM digital_products WHERE id = ?");
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
