<?php
declare(strict_types=1);
namespace StreamVision\Channel;
use PDO;
use StreamVision\Core\Jwt;
use StreamVision\Core\Response;

final class ChannelController {
    public function __construct(private PDO $pdo, private Jwt $jwt) {}

    public function home(): never {
        $user = $this->jwt->requireUser();
        Response::json([
            'banners' => $this->pdo->query('SELECT id, title, subtitle, image_url imageUrl, channel_id channelId FROM banners WHERE is_active = 1 ORDER BY sort_order LIMIT 5')->fetchAll(),
            'featured' => $this->channels(['featured' => '1']),
            'trending' => $this->channels(['trending' => '1']),
            'recentlyWatched' => $this->historyRows((int)$user['sub']),
            'categories' => $this->pdo->query('SELECT id, name, slug, sort_order sortOrder FROM categories WHERE is_active = 1 ORDER BY sort_order')->fetchAll(),
        ]);
    }

    public function index(array $query): never { $this->jwt->requireUser(); Response::json($this->channels($query)); }

    public function favorite(array $body): never {
        $user = $this->jwt->requireUser();
        $channelId = filter_var($body['channelId'] ?? null, FILTER_VALIDATE_INT);
        if (!$channelId) Response::json(['error' => 'Invalid channelId'], 422);
        $this->pdo->prepare('INSERT INTO favorites (user_id, channel_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE created_at = NOW()')->execute([(int)$user['sub'], $channelId]);
        Response::json(['ok' => true]);
    }

    public function history(array $body): never {
        $user = $this->jwt->requireUser();
        $channelId = filter_var($body['channelId'] ?? null, FILTER_VALIDATE_INT);
        $position = max(0, (int)($body['positionSeconds'] ?? 0));
        if (!$channelId) Response::json(['error' => 'Invalid channelId'], 422);
        $this->pdo->prepare('INSERT INTO watch_history (user_id, channel_id, position_seconds, watched_at) VALUES (?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE position_seconds = VALUES(position_seconds), watched_at = NOW()')->execute([(int)$user['sub'], $channelId, $position]);
        Response::json(['ok' => true]);
    }

    private function channels(array $query): array {
        $where = ['c.deleted_at IS NULL', 'c.is_active = 1'];
        $args = [];
        if (!empty($query['category'])) { $where[] = 'cat.slug = ?'; $args[] = $query['category']; }
        if (!empty($query['q'])) { $where[] = '(c.name LIKE ? OR cat.name LIKE ?)'; $args[] = '%' . $query['q'] . '%'; $args[] = '%' . $query['q'] . '%'; }
        if (!empty($query['featured'])) $where[] = 'c.is_featured = 1';
        if (!empty($query['trending'])) $where[] = 'c.trending_score > 0';
        $sql = 'SELECT c.id, c.name, c.stream_url streamUrl, c.stream_type streamType, c.logo_url logoUrl, c.epg_id epgId, c.is_featured isFeatured, cat.id categoryId, cat.name categoryName, cat.slug categorySlug FROM channels c LEFT JOIN categories cat ON cat.id = c.category_id WHERE ' . implode(' AND ', $where) . ' ORDER BY c.trending_score DESC, c.sort_order ASC LIMIT 100';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($args);
        return array_map(fn($r) => $this->mapChannel($r), $stmt->fetchAll());
    }

    private function historyRows(int $userId): array {
        $stmt = $this->pdo->prepare('SELECT c.id, c.name, c.stream_url streamUrl, c.stream_type streamType, c.logo_url logoUrl, c.epg_id epgId, c.is_featured isFeatured, cat.id categoryId, cat.name categoryName, cat.slug categorySlug, h.watched_at watchedAt, h.position_seconds positionSeconds FROM watch_history h JOIN channels c ON c.id = h.channel_id LEFT JOIN categories cat ON cat.id = c.category_id WHERE h.user_id = ? ORDER BY h.watched_at DESC LIMIT 20');
        $stmt->execute([$userId]);
        return array_map(fn($r) => ['channel' => $this->mapChannel($r), 'watchedAt' => $r['watchedAt'], 'positionSeconds' => (int)$r['positionSeconds']], $stmt->fetchAll());
    }

    private function mapChannel(array $r): array {
        return ['id' => (int)$r['id'], 'name' => $r['name'], 'streamUrl' => $r['streamUrl'], 'streamType' => $r['streamType'], 'logoUrl' => $r['logoUrl'], 'epgId' => $r['epgId'], 'isFeatured' => (bool)$r['isFeatured'], 'category' => $r['categoryId'] ? ['id' => (int)$r['categoryId'], 'name' => $r['categoryName'], 'slug' => $r['categorySlug'], 'sortOrder' => 0] : null];
    }
}
