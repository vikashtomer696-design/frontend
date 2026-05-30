<?php
require __DIR__.'/database.php';
require_token(); rate_limit('transcript', 30, 3600);
$in = input(); $url = trim($in['youtube_url'] ?? '');
if (!preg_match('/(youtube\.com|youtu\.be)/i', $url)) out(false, null, 'Invalid YouTube URL');
$html = @file_get_contents($url);
$title = 'Imported YouTube Story';
if ($html && preg_match('/<title>(.*?)<\/title>/is', $html, $m)) $title = html_entity_decode(str_replace(' - YouTube','',trim($m[1])), ENT_QUOTES);
$transcript = '';
if ($html && preg_match('/"captionTracks":(\[.*?\])/', $html, $m)) {
    $tracks = json_decode(str_replace('\\u0026', '&', $m[1]), true);
    $base = $tracks[0]['baseUrl'] ?? '';
    if ($base) { $xml = @file_get_contents($base); if ($xml) $transcript = trim(strip_tags(str_replace(['</text>','<text'], [". ", '<text'], html_entity_decode($xml)))); }
}
if (!$transcript) $transcript = 'The source video title is '.$title.'. Build an original educational whiteboard story inspired only by the high level topic, with a strong hook, emotional pacing, practical examples, and clear ending.';
out(true, ['title'=>$title, 'transcript'=>$transcript, 'durationSeconds'=>180]);
