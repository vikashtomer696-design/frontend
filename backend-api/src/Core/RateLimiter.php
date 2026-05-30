<?php
declare(strict_types=1);
namespace StreamVision\Core;
use PDO;

final class RateLimiter {
    public function __construct(private PDO $pdo) {}
    public function enforce(string $key, int $limit = 120): void {
        $hash = hash('sha256', $key);
        $this->pdo->prepare('INSERT INTO rate_limits (rate_key, hits, window_start) VALUES (?, 1, NOW()) ON DUPLICATE KEY UPDATE hits = IF(window_start < DATE_SUB(NOW(), INTERVAL 1 MINUTE), 1, hits + 1), window_start = IF(window_start < DATE_SUB(NOW(), INTERVAL 1 MINUTE), NOW(), window_start)')->execute([$hash]);
        $stmt = $this->pdo->prepare('SELECT hits FROM rate_limits WHERE rate_key = ? AND window_start >= DATE_SUB(NOW(), INTERVAL 1 MINUTE)');
        $stmt->execute([$hash]);
        if ((int)$stmt->fetchColumn() > $limit) Response::json(['error' => 'Rate limit exceeded'], 429);
    }
}
