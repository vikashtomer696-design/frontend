<?php
declare(strict_types=1);

require __DIR__ . '/../src/Core/Database.php';
require __DIR__ . '/../src/Core/Response.php';
require __DIR__ . '/../src/Core/Jwt.php';
require __DIR__ . '/../src/Core/RateLimiter.php';
require __DIR__ . '/../src/Auth/AuthController.php';
require __DIR__ . '/../src/Channel/ChannelController.php';
require __DIR__ . '/../src/Playlist/M3uController.php';
require __DIR__ . '/../src/Admin/AdminController.php';

use StreamVision\Core\Database;
use StreamVision\Core\Response;
use StreamVision\Core\Jwt;
use StreamVision\Core\RateLimiter;
use StreamVision\Auth\AuthController;
use StreamVision\Channel\ChannelController;
use StreamVision\Playlist\M3uController;
use StreamVision\Admin\AdminController;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . ($_ENV['CORS_ORIGIN'] ?? '*'));
header('Access-Control-Allow-Headers: Authorization, Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$pdo = Database::connect();
$jwt = new Jwt($_ENV['JWT_SECRET'] ?? 'change-me-in-production');
$limiter = new RateLimiter($pdo);
$limiter->enforce($_SERVER['REMOTE_ADDR'] ?? 'unknown');

$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$path = preg_replace('#^api/v1/?#', '', $path);
$method = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input') ?: '{}', true) ?: [];

try {
    $auth = new AuthController($pdo, $jwt);
    $channels = new ChannelController($pdo, $jwt);
    $m3u = new M3uController($pdo, $jwt);
    $admin = new AdminController($pdo, $jwt);

    match (true) {
        $method === 'POST' && $path === 'auth/login' => $auth->login($body),
        $method === 'POST' && $path === 'auth/google' => $auth->google($body),
        $method === 'POST' && $path === 'auth/guest' => $auth->guest(),
        $method === 'GET' && $path === 'home' => $channels->home(),
        $method === 'GET' && $path === 'channels' => $channels->index($_GET),
        $method === 'POST' && $path === 'favorites' => $channels->favorite($body),
        $method === 'POST' && $path === 'history' => $channels->history($body),
        $method === 'POST' && $path === 'm3u/import-url' => $m3u->importUrl($body),
        $method === 'GET' && $path === 'admin/dashboard' => $admin->dashboard(),
        $method === 'POST' && $path === 'admin/channels' => $admin->createChannel($body),
        $method === 'PUT' && preg_match('#^admin/channels/(\d+)$#', $path, $m) => $admin->updateChannel((int)$m[1], $body),
        $method === 'DELETE' && preg_match('#^admin/channels/(\d+)$#', $path, $m) => $admin->deleteChannel((int)$m[1]),
        default => Response::json(['error' => 'Not found'], 404),
    };
} catch (Throwable $e) {
    Response::json(['error' => 'Server error', 'requestId' => bin2hex(random_bytes(6))], 500);
}
