<?php
/**
 * Front controller — routes /api/* to the matching handler.
 *
 * Examples:
 *   GET  /api/products
 *   GET  /api/products/etwin-aura-headphones
 *   GET  /api/digital-products
 *   POST /api/orders
 *   POST /api/contact
 */

require_once __DIR__ . "/config/cors.php";

$base = rtrim(str_replace("\\", "/", dirname($_SERVER["SCRIPT_NAME"])), "/");
$uri  = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
if ($base && strpos($uri, $base) === 0) {
    $uri = substr($uri, strlen($base));
}
$uri = trim($uri, "/");
$segments = $uri === "" ? [] : explode("/", $uri);

// Strip leading "api"
if (isset($segments[0]) && $segments[0] === "api") {
    array_shift($segments);
}

$resource = $segments[0] ?? "";
$param    = $segments[1] ?? null;
$action   = $segments[2] ?? null;

switch ($resource) {
    case "":
        echo json_encode([
            "name"    => "eTwin API",
            "version" => "1.0",
            "endpoints" => [
                "GET  /api/products",
                "GET  /api/products/{id}",
                "GET  /api/digital-products",
                "GET  /api/digital-products/{id}",
                "GET  /api/services",
                "GET  /api/orders",
                "POST /api/orders",
                "POST /api/contact",
                "POST /api/services/request",
            ],
        ], JSON_PRETTY_PRINT);
        break;

    case "products":
        $_GET["id"] = $param;
        require __DIR__ . "/api/products.php";
        break;

    case "digital-products":
        $_GET["id"] = $param;
        require __DIR__ . "/api/digital-products.php";
        break;

    case "services":
        if ($param === "request") {
            require __DIR__ . "/api/service-request.php";
        } else {
            require __DIR__ . "/api/services.php";
        }
        break;

    case "orders":
        $_GET["id"] = $param;
        require __DIR__ . "/api/orders.php";
        break;

    case "contact":
        require __DIR__ . "/api/contact.php";
        break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "Route not found: /$uri"]);
}
