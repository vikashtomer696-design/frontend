# StreamVision TV

StreamVision TV is a production-ready Android TV starter for legal live streaming, user-provided M3U playlists, and secure channel administration.

## What is included

- Android TV app scaffold in `android-app/` using Kotlin, Jetpack Compose Material 3, AndroidX Media3 ExoPlayer, and remote-friendly focus UI.
- PHP/MySQL API in `backend-api/` with JWT auth, guest login, protected channels, M3U import, favorites, watch history, rate limiting, and admin endpoints.
- MySQL schema in `database/schema.sql` for users, channels, categories, favorites, watch history, settings, banners, announcements, playlist channels, stream sessions, and rate limits.
- Documentation in `docs/` for API usage, local installation, and production deployment.
- Web preview pages (`index.html`, `dashboard.html`) that summarize the product and admin capabilities.

## Legal streaming policy

This project does not ship copyrighted or unauthorized stream URLs. Configure only streams that are owned by you, licensed to you, explicitly public with redistribution rights, or supplied by users for lawful personal use.

## Quick start

See `docs/INSTALLATION.md` for Android Studio, PHP, and MySQL setup steps.
