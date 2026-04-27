<?php
/**
 * Front controller — routes /api/* to the matching handler.
 */
require_once __DIR__ . "/config/cors.php";

$base = rtrim(str_replace("\\", "/", dirname($_SERVER["SCRIPT_NAME"])), "/");
$uri  = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
if ($base && strpos($uri, $base) === 0) {
    $uri = substr($uri, strlen($base));
}
$uri = trim($uri, "/");
$segments = $uri === "" ? [] : explode("/", $uri);

if (isset($segments[0]) && $segments[0] === "api") array_shift($segments);

$resource = $segments[0] ?? "";
$param    = $segments[1] ?? null;

switch ($resource) {
    case "":
        echo json_encode(["name" => "eTwin API", "version" => "3.0"], JSON_PRETTY_PRINT);
        break;

    case "admin":
        $_GET["action"] = $param;
        require __DIR__ . "/api/admin-auth.php";
        break;

    case "stats":
        require __DIR__ . "/api/stats.php";
        break;

    case "products":
        $_GET["id"] = $param;
        require __DIR__ . "/api/products.php";
        break;

    case "categories":
        $_GET["id"] = $param;
        require __DIR__ . "/api/categories.php";
        break;

    case "digital-products":
        $_GET["id"] = $param;
        require __DIR__ . "/api/digital-products.php";
        break;

    case "services":
        if ($param === "request") {
            require __DIR__ . "/api/service-request.php";
        } else {
            $_GET["id"] = $param;
            require __DIR__ . "/api/services.php";
        }
        break;

    case "orders":
        $_GET["id"] = $param;
        require __DIR__ . "/api/orders.php";
        break;

    case "messages":
        $_GET["id"] = $param;
        require __DIR__ . "/api/messages.php";
        break;

    case "requests":
        $_GET["id"] = $param;
        require __DIR__ . "/api/requests.php";
        break;

    case "contact":
        require __DIR__ . "/api/contact.php";
        break;

    case "settings":
        require __DIR__ . "/api/settings.php";
        break;

    case "uploads":
        require __DIR__ . "/api/uploads.php";
        break;

    case "downloads":
        require __DIR__ . "/api/downloads.php";
        break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "Route not found: /$uri"]);
}
