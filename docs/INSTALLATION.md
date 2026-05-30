# Installation Guide

## Android app

1. Open the repository in Android Studio Ladybug or newer.
2. Set the API base URL in `ApiClient.create(...)` integration code for your environment.
3. Build the TV app:

```bash
./gradlew :android-app:assembleDebug
```

4. Install on an Android TV emulator or device:

```bash
adb install android-app/build/outputs/apk/debug/android-app-debug.apk
```

## Backend API

1. Create a MySQL database and import the schema:

```bash
mysql -u root -p < database/schema.sql
```

2. Configure environment variables:

```bash
export DB_HOST=127.0.0.1
export DB_NAME=streamvision
export DB_USER=streamvision
export DB_PASS='replace-me'
export JWT_SECRET='replace-with-32-plus-random-bytes'
export CORS_ORIGIN='https://admin.yourdomain.example'
```

3. Serve the API locally:

```bash
php -S 127.0.0.1:8080 -t backend-api/public
```

## Legal streams

StreamVision TV intentionally ships without copyrighted stream URLs. Add only streams that you own, have licensed, are explicitly authorized to distribute, or are provided by users for their own lawful viewing.
