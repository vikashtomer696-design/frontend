<?php
declare(strict_types=1);
namespace StreamVision\Admin;
use PDO;
use StreamVision\Core\Jwt;
use StreamVision\Core\Response;

final class AdminController {
    public function __construct(private PDO $pdo, private Jwt $jwt) {}

    public function dashboard(): never {
        $this->requireAdmin();
        Response::json([
            'totalUsers' => (int)$this->pdo->query('SELECT COUNT(*) FROM users WHERE deleted_at IS NULL')->fetchColumn(),
            'activeStreams' => (int)$this->pdo->query('SELECT COUNT(*) FROM stream_sessions WHERE ended_at IS NULL')->fetchColumn(),
            'channels' => (int)$this->pdo->query('SELECT COUNT(*) FROM channels WHERE deleted_at IS NULL')->fetchColumn(),
            'favorites' => (int)$this->pdo->query('SELECT COUNT(*) FROM favorites')->fetchColumn(),
        ]);
    }

    public function createChannel(array $body): never {
        $this->requireAdmin();
        $data = $this->validateChannel($body);
        $stmt = $this->pdo->prepare('INSERT INTO channels (name, stream_url, stream_type, logo_url, epg_id, category_id, is_featured, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)');
        $stmt->execute([$data['name'], $data['streamUrl'], $data['streamType'], $data['logoUrl'], $data['epgId'], $data['categoryId'], $data['isFeatured']]);
        Response::json(['id' => (int)$this->pdo->lastInsertId()], 201);
    }

    public function updateChannel(int $id, array $body): never {
        $this->requireAdmin();
        $data = $this->validateChannel($body);
        $stmt = $this->pdo->prepare('UPDATE channels SET name=?, stream_url=?, stream_type=?, logo_url=?, epg_id=?, category_id=?, is_featured=?, updated_at=NOW() WHERE id=? AND deleted_at IS NULL');
        $stmt->execute([$data['name'], $data['streamUrl'], $data['streamType'], $data['logoUrl'], $data['epgId'], $data['categoryId'], $data['isFeatured'], $id]);
        Response::json(['ok' => true]);
    }

    public function deleteChannel(int $id): never {
        $this->requireAdmin();
        $this->pdo->prepare('UPDATE channels SET deleted_at = NOW(), is_active = 0 WHERE id = ?')->execute([$id]);
        Response::json(['ok' => true]);
    }

    private function requireAdmin(): array {
        $user = $this->jwt->requireUser();
        if (($user['role'] ?? '') !== 'admin') Response::json(['error' => 'Forbidden'], 403);
        return $user;
    }

    private function validateChannel(array $body): array {
        $url = filter_var($body['streamUrl'] ?? '', FILTER_VALIDATE_URL);
        if (!$url || !str_starts_with($url, 'https://')) Response::json(['error' => 'Use an HTTPS authorized stream URL'], 422);
        return [
            'name' => trim((string)($body['name'] ?? '')) ?: Response::json(['error' => 'Name is required'], 422),
            'streamUrl' => $url,
            'streamType' => in_array($body['streamType'] ?? 'hls', ['hls', 'dash', 'progressive'], true) ? $body['streamType'] : 'hls',
            'logoUrl' => filter_var($body['logoUrl'] ?? null, FILTER_VALIDATE_URL) ?: null,
            'epgId' => trim((string)($body['epgId'] ?? '')) ?: null,
            'categoryId' => filter_var($body['categoryId'] ?? null, FILTER_VALIDATE_INT) ?: null,
            'isFeatured' => !empty($body['isFeatured']) ? 1 : 0,
        ];
    }
}
