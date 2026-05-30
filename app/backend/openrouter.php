<?php
require __DIR__.'/database.php';
require_token(); rate_limit('openrouter', 12, 3600);
$in = input(); $transcript = trim($in['transcript'] ?? ''); $title = trim($in['title'] ?? 'Video');
if ($transcript === '') out(false, null, 'Transcript is empty');
$prompt = "Analyze this YouTube transcript. Understand emotional pacing, storytelling structure, narration tone, engagement pattern, hook style. Now generate a completely original whiteboard animation script, copyright-safe narration, emotional storytelling, scene directions, animation instructions, and whiteboard drawing prompts. Do NOT copy wording. Return strict JSON with keys narration,tone,hook,scenes. Each scene has id,title,narration,drawingPrompt,durationMs,elements. Elements use type PATH,RECT,CIRCLE,TEXT,ARROW with points array and optional text. Transcript: ".$transcript;
$payload = ['model'=>'google/gemini-2.5-flash','messages'=>[['role'=>'system','content'=>'You generate valid JSON for Android whiteboard animation scenes. Coordinates use 1280x720 canvas.'],['role'=>'user','content'=>$prompt]],'response_format'=>['type'=>'json_object']];
function openrouter_call(array $payload): ?array {
    $ch = curl_init('https://openrouter.ai/api/v1/chat/completions');
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER=>true, CURLOPT_POST=>true, CURLOPT_HTTPHEADER=>['Content-Type: application/json','Authorization: Bearer '.envv('OPENROUTER_API_KEY'),'HTTP-Referer: '.envv('APP_URL','https://example.com'),'X-Title: AI Whiteboard Studio'], CURLOPT_POSTFIELDS=>json_encode($payload), CURLOPT_TIMEOUT=>120]);
    $body = curl_exec($ch); $code = curl_getinfo($ch, CURLINFO_RESPONSE_CODE); curl_close($ch);
    if ($body === false || $code >= 400) return null;
    return json_decode((string)$body, true) ?: null;
}
$res = openrouter_call($payload);
if (!$res) { $payload['model'] = 'anthropic/claude-sonnet-4.5'; $res = openrouter_call($payload); }
$content = $res['choices'][0]['message']['content'] ?? '';
$data = json_decode($content, true);
if (!$data || empty($data['scenes'])) {
    $data = ['narration'=>'Discover the core idea behind '.$title.' through a fresh visual story designed for learning and retention.','tone'=>'curious, confident, cinematic','hook'=>'A fresh way to understand '.$title,'scenes'=>[
        ['id'=>'s1','title'=>'The Hook','narration'=>'Every big idea starts with a simple question.', 'drawingPrompt'=>'whiteboard doodle question mark lightbulb minimalist line art transparent background','durationMs'=>4500,'elements'=>[['type'=>'CIRCLE','points'=>[260,280,90]],['type'=>'TEXT','points'=>[420,285],'text'=>'What changed?'],['type'=>'ARROW','points'=>[360,285,410,285]]]],
        ['id'=>'s2','title'=>'The Framework','narration'=>'We break the concept into three clear steps.', 'drawingPrompt'=>'whiteboard three step framework boxes arrows','durationMs'=>5200,'elements'=>[['type'=>'RECT','points'=>[150,220,220,120]],['type'=>'RECT','points'=>[530,220,220,120]],['type'=>'RECT','points'=>[910,220,220,120]],['type'=>'TEXT','points'=>[200,290],'text'=>'1'],['type'=>'TEXT','points'=>[580,290],'text'=>'2'],['type'=>'TEXT','points'=>[960,290],'text'=>'3']]]
    ]];
}
out(true, $data);
