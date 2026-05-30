# Deployment Guide

## Android production checklist

- Replace placeholder stream metadata with licensed sources from your backend.
- Enable R8 minification for release builds.
- Sign with a Play Console upload key.
- Test DPAD focus, overscan-safe layouts, subtitles, audio tracks, HLS, DASH, and network recovery on real TV hardware.

## PHP API production checklist

- Run PHP 8.2+ behind Nginx and PHP-FPM.
- Set `JWT_SECRET` to a high-entropy secret from your secret manager.
- Use HTTPS only and reject non-TLS playlist/stream URLs.
- Store MySQL credentials outside the document root.
- Enable slow query logging and database backups.
- Add a cron job to clear stale `rate_limits` rows and close abandoned `stream_sessions`.

## Example Nginx location

```nginx
location /api/v1/ {
    try_files $uri /index.php$is_args$args;
}
location ~ \.php$ {
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    fastcgi_pass unix:/run/php/php8.2-fpm.sock;
}
```

## Security notes

- All SQL statements in the API use PDO prepared statements for user inputs.
- Rate limiting is applied per remote address.
- Admin operations require an `admin` JWT role.
- Validate stream ownership/licensing before publishing a channel.
