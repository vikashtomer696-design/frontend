# Project Structure

```text
StreamVisionTV/
├── android-app/                 # Android TV app module
│   ├── build.gradle             # Android, Kotlin, Compose, Media3 dependencies
│   └── src/main/
│       ├── AndroidManifest.xml  # Leanback launcher and TV feature declarations
│       ├── java/com/streamvision/tv/
│       │   ├── MainActivity.kt
│       │   ├── data/            # API models, Retrofit service, repositories
│       │   ├── media/           # Media3 ExoPlayer integration
│       │   ├── ui/              # Material 3 theme
│       │   ├── ui/screens/      # Home, Live TV, Search, Player, Profile, Settings
│       │   └── util/            # M3U parser
│       └── res/                 # Theme and launcher vector assets
├── backend-api/
│   ├── public/index.php         # Versioned REST API front controller
│   └── src/
│       ├── Admin/               # Dashboard and channel management
│       ├── Auth/                # Email, Google, and guest auth
│       ├── Channel/             # Home, channel search, favorites, history
│       ├── Core/                # PDO, JWT, response, rate limiter
│       └── Playlist/            # M3U URL import and parsing
├── database/schema.sql          # Complete MySQL schema and seed categories
├── assets/
│   ├── icons/                   # Store/adaptive icon notes
│   └── images/splash.svg        # Splash/hero visual asset
├── docs/
│   ├── API.md                   # REST API documentation
│   ├── DEPLOYMENT.md            # Production deployment guide
│   ├── INSTALLATION.md          # Local install instructions
│   └── PROJECT_STRUCTURE.md     # This file
├── index.html                   # Product web preview
├── dashboard.html               # Admin panel web preview
├── styles.css                   # Dark glassmorphism preview styling
├── build.gradle                 # Root Gradle plugins
├── settings.gradle              # Gradle module registration
└── gradle.properties            # AndroidX/Kotlin build flags
```
