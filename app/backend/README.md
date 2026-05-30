# InfinityFree backend deployment

1. Create a MySQL database in InfinityFree control panel and import `schema.sql`.
2. Upload all PHP files to `htdocs/backend` and create writable `htdocs/backend/generated`.
3. Configure environment variables when your host supports them, or define them in `.htaccess` with `SetEnv`: `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`, `OPENROUTER_API_KEY`, `ELEVENLABS_API_KEY`, `APP_URL`.
4. In the Android app Settings screen, set backend URL to `https://your-domain.infinityfreeapp.com/backend/`.
5. API keys remain server-side. The Android app receives only short-lived login tokens.
