<?php
declare(strict_types=1);
namespace StreamVision\Playlist;
use PDO;
use StreamVision\Core\Jwt;
use StreamVision\Core\Response;

final class M3uController {
    public function __construct(private PDO $pdo, private Jwt $jwt) {}

    public function importUrl(array $body): never {
        $user = $this->jwt->requireUser();
        $url = filter_var($body['url'] ?? '', FILTER_VALIDATE_URL);
        if (!$url || !str_starts_with($url, 'https://')) Response::json(['error' => 'Playlist URL must be HTTPS'], 422);
        $content = file_get_contents($url, false, stream_context_create(['http' => ['timeout' => 10, 'user_agent' => 'StreamVisionTV/1.0']]));
        if ($content === false || !str_starts_with(trim($content), '#EXTM3U')) Response::json(['error' => 'Invalid M3U playlist'], 422);
        $channels = $this->parse($content);
        foreach ($channels as $channel) {
            $stmt = $this->pdo->prepare('INSERT INTO playlist_channels (user_id, name, stream_url, stream_type, logo_url, epg_id, group_title) VALUES (?, ?, ?, ?, ?, ?, ?)');
            $stmt->execute([(int)$user['sub'], $channel['name'], $channel['streamUrl'], $channel['streamType'], $channel['logoUrl'], $channel['epgId'], $channel['groupTitle']]);
        }
        Response::json(['total' => count($channels), 'channels' => $channels]);
    }

    private function parse(string $content): array {
        $lines = array_values(array_filter(array_map('trim', explode("\n", $content))));
        $pending = ['name' => 'Untitled Channel', 'logoUrl' => null, 'epgId' => null, 'groupTitle' => null];
        $channels = [];
        foreach ($lines as $line) {
            if (str_starts_with($line, '#EXTINF')) {
                preg_match_all('/([\w-]+)="([^"]*)"/', $line, $matches, PREG_SET_ORDER);
                foreach ($matches as $m) {
                    if ($m[1] === 'tvg-logo') $pending['logoUrl'] = $m[2];
                    if ($m[1] === 'tvg-id') $pending['epgId'] = $m[2];
                    if ($m[1] === 'group-title') $pending['groupTitle'] = $m[2];
                    if ($m[1] === 'tvg-name') $pending['name'] = $m[2];
                }
                $pending['name'] = trim(substr($line, strrpos($line, ',') + 1)) ?: $pending['name'];
            } elseif (!str_starts_with($line, '#')) {
                $channels[] = $pending + ['streamUrl' => $line, 'streamType' => str_contains($line, '.mpd') ? 'dash' : (str_contains($line, '.m3u8') ? 'hls' : 'progressive')];
                $pending = ['name' => 'Untitled Channel', 'logoUrl' => null, 'epgId' => null, 'groupTitle' => null];
            }
        }
        return $channels;
    }
}
