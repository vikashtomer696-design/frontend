<?php
require __DIR__.'/database.php';
require_token(); rate_limit('voice', 20, 3600);
$in = input(); $text = trim($in['text'] ?? ''); $voice = preg_replace('/[^A-Za-z0-9]/','', $in['voiceId'] ?? '21m00Tcm4TlvDq8ikWAM');
if ($text === '') out(false, null, 'Text is empty');
$payload = ['text'=>$text, 'model_id'=>'eleven_multilingual_v2', 'voice_settings'=>['stability'=>0.45,'similarity_boost'=>0.8,'style'=>0.35,'use_speaker_boost'=>true]];
$ch = curl_init('https://api.elevenlabs.io/v1/text-to-speech/'.$voice);
curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER=>true, CURLOPT_POST=>true, CURLOPT_HTTPHEADER=>['Content-Type: application/json','xi-api-key: '.envv('ELEVENLABS_API_KEY')], CURLOPT_POSTFIELDS=>json_encode($payload), CURLOPT_TIMEOUT=>120]);
$audio = curl_exec($ch); $code = curl_getinfo($ch, CURLINFO_RESPONSE_CODE); curl_close($ch);
if ($audio === false || $code >= 400) out(false, null, 'ElevenLabs voice generation failed');
$dir = __DIR__.'/generated'; if (!is_dir($dir)) mkdir($dir, 0755, true);
$name = 'voice_'.time().'_'.bin2hex(random_bytes(4)).'.mp3'; file_put_contents($dir.'/'.$name, $audio);
$base = rtrim(envv('APP_URL'), '/').'/backend/generated/'.$name;
out(true, ['audio_url'=>$base, 'bytes'=>strlen($audio)]);
