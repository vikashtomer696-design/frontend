# AI Whiteboard Studio Android

A Kotlin + Jetpack Compose Android Studio project for generating AI-assisted whiteboard animation videos from YouTube inspiration. The app uses an InfinityFree-compatible PHP/MySQL relay backend so API keys never ship in the APK.

## Features

- YouTube URL analyzer and transcript extractor
- OpenRouter story/script/scene generation using `google/gemini-2.5-flash` with server-side fallback scaffolding
- Pollinations whiteboard image prompt relay
- ElevenLabs voiceover relay
- Jetpack Compose dark cinematic glassmorphism UI with neon animated buttons
- Canvas based whiteboard preview with stroke reveal, scene list, voice preview, downloads, settings, and MP4 export
- FFmpeg Kit Android export pipeline that renders Canvas frames and encodes MP4
- MVVM + Repository + Retrofit + OkHttp + Coroutines + StateFlow architecture
- InfinityFree PHP backend with MySQL schema, token auth, and rate limiting

## Android Studio setup

1. Open this repository in Android Studio.
2. Install Android SDK 35 and JDK 17.
3. Sync Gradle and run the `app` configuration on Android 8.0+.
4. Open Settings in the app and set your hosted backend URL, for example `https://your-domain.infinityfreeapp.com/backend/`.

## Backend setup

See `app/backend/README.md`. Import `app/backend/schema.sql`, upload PHP files to InfinityFree, configure `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`, `OPENROUTER_API_KEY`, `ELEVENLABS_API_KEY`, and `APP_URL`, then create a writable `generated` directory.

## Security model

The Android app stores only the backend URL and a login token in DataStore. OpenRouter and ElevenLabs API keys are read only by PHP backend endpoints. PHP endpoints enforce token checks and IP rate limits backed by MySQL.
