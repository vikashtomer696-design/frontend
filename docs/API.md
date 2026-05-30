# StreamVision TV API

Base path: `/api/v1`. All protected endpoints require `Authorization: Bearer <jwt>`.

## Authentication

### `POST /auth/login`
Request: `{ "email": "admin@example.com", "password": "minimum-8" }`
Response: `{ "token": "...", "expiresAt": "...", "user": { ... } }`

### `POST /auth/google`
Request: `{ "idToken": "google-id-token" }`. Production deployments must verify the Google token against the configured OAuth client ID before upsert.

### `POST /auth/guest`
Creates a short-lived guest session for trial browsing and user-provided playlists.

## Home and Channels

### `GET /home`
Returns banners, featured channels, trending channels, recently watched channels, and categories.

### `GET /channels?category=news&q=public`
Returns authorized channels filtered by category slug and/or search query.

### `POST /favorites`
Request: `{ "channelId": 1 }`.

### `POST /history`
Request: `{ "channelId": 1, "positionSeconds": 42 }`.

## M3U

### `POST /m3u/import-url`
Request: `{ "url": "https://customer-owned-domain.example/playlist.m3u", "epgUrl": "https://customer-owned-domain.example/epg.xml" }`.
Only HTTPS user-provided or legally authorized playlist URLs should be accepted.

## Admin

Admin endpoints require a JWT with `role=admin`.

- `GET /admin/dashboard`
- `POST /admin/channels`
- `PUT /admin/channels/{id}`
- `DELETE /admin/channels/{id}`

Channel payload: `{ "name": "Channel", "streamUrl": "https://licensed-cdn.example/live.m3u8", "streamType": "hls", "logoUrl": "https://...", "epgId": "channel.id", "categoryId": 1, "isFeatured": true }`.
