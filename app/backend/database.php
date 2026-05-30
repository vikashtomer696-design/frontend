<?php
declare(strict_types=1);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

function envv(string $key, string $default = ''): string { $value = getenv($key); return $value === false ? $default : $value; }
function db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    $dsn = 'mysql:host='.envv('DB_HOST').';dbname='.envv('DB_NAME').';charset=utf8mb4';
    $pdo = new PDO($dsn, envv('DB_USER'), envv('DB_PASS'), [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
    return $pdo;
}
function input(): array { return json_decode(file_get_contents('php://input') ?: '{}', true) ?: []; }
function out(bool $ok, $data = null, string $error = ''): void { echo json_encode(['ok'=>$ok, 'data'=>$data, 'error'=>$error], JSON_UNESCAPED_SLASHES); exit; }
function bearer(): string { $h = $_SERVER['HTTP_AUTHORIZATION'] ?? ''; return preg_replace('/^Bearer\s+/i', '', $h); }
function require_token(): string { $token = bearer(); if (!$token) out(false, null, 'Missing token'); return $token; }
function rate_limit(string $bucket, int $max = 20, int $windowSeconds = 3600): void {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $key = hash('sha256', $bucket.$ip.date('YmdH', (int)(time() / $windowSeconds) * $windowSeconds));
    $stmt = db()->prepare('INSERT INTO rate_limits(rate_key, hits, expires_at) VALUES(?,1,DATE_ADD(NOW(), INTERVAL ? SECOND)) ON DUPLICATE KEY UPDATE hits=hits+1');
    $stmt->execute([$key, $windowSeconds]);
    $hits = (int)db()->query('SELECT hits FROM rate_limits WHERE rate_key='.db()->quote($key))->fetchColumn();
    if ($hits > $max) out(false, null, 'Rate limit exceeded. Try again later.');
}
function http_json(string $url, array $payload, array $headers = [], int $timeout = 120): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER=>true, CURLOPT_POST=>true, CURLOPT_HTTPHEADER=>array_merge(['Content-Type: application/json'], $headers), CURLOPT_POSTFIELDS=>json_encode($payload), CURLOPT_TIMEOUT=>$timeout]);
    $body = curl_exec($ch); $code = curl_getinfo($ch, CURLINFO_RESPONSE_CODE); $err = curl_error($ch); curl_close($ch);
    if ($body === false || $code >= 400) out(false, null, 'Upstream error '.$code.' '.$err.' '.substr((string)$body, 0, 300));
    return json_decode((string)$body, true) ?: [];
}
function uuid(): string { return bin2hex(random_bytes(16)); }
