<?php
require __DIR__.'/database.php';
require_token(); rate_limit('pollinations', 40, 3600);
$in = input(); $prompt = trim($in['prompt'] ?? 'whiteboard doodle'); $w=(int)($in['width'] ?? 1280); $h=(int)($in['height'] ?? 720);
$url = 'https://image.pollinations.ai/prompt/'.rawurlencode($prompt.' whiteboard doodle marker sketch minimalist line art transparent background').'?width='.$w.'&height='.$h.'&nologo=true';
out(true, ['image_url'=>$url]);
