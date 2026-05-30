CREATE DATABASE IF NOT EXISTS streamvision CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE streamvision;

CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NULL UNIQUE,
  password_hash VARCHAR(255) NULL,
  provider ENUM('email','google','guest') NOT NULL DEFAULT 'email',
  role ENUM('user','admin','guest') NOT NULL DEFAULT 'user',
  avatar_url VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  INDEX idx_users_role (role),
  INDEX idx_users_deleted (deleted_at)
);

CREATE TABLE categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(140) NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE channels (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  stream_url VARCHAR(1000) NOT NULL,
  stream_type ENUM('hls','dash','progressive') NOT NULL DEFAULT 'hls',
  logo_url VARCHAR(1000) NULL,
  epg_id VARCHAR(190) NULL,
  category_id BIGINT UNSIGNED NULL,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  trending_score INT NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  CONSTRAINT fk_channels_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_channels_category (category_id),
  INDEX idx_channels_featured (is_featured),
  INDEX idx_channels_active (is_active, deleted_at),
  FULLTEXT KEY ft_channels_name (name)
);

CREATE TABLE favorites (
  user_id BIGINT UNSIGNED NOT NULL,
  channel_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, channel_id),
  CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_favorites_channel FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE
);

CREATE TABLE watch_history (
  user_id BIGINT UNSIGNED NOT NULL,
  channel_id BIGINT UNSIGNED NOT NULL,
  position_seconds INT UNSIGNED NOT NULL DEFAULT 0,
  watched_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, channel_id),
  CONSTRAINT fk_history_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_history_channel FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE,
  INDEX idx_history_watched (watched_at)
);

CREATE TABLE settings (
  user_id BIGINT UNSIGNED PRIMARY KEY,
  theme ENUM('dark','system') NOT NULL DEFAULT 'dark',
  language VARCHAR(12) NOT NULL DEFAULT 'en',
  autoplay TINYINT(1) NOT NULL DEFAULT 1,
  preferred_bitrate INT NULL,
  cache_limit_mb INT NOT NULL DEFAULT 512,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE playlist_channels (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(160) NOT NULL,
  stream_url VARCHAR(1000) NOT NULL,
  stream_type ENUM('hls','dash','progressive') NOT NULL DEFAULT 'hls',
  logo_url VARCHAR(1000) NULL,
  epg_id VARCHAR(190) NULL,
  group_title VARCHAR(160) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_playlist_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_playlist_user (user_id)
);

CREATE TABLE banners (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  subtitle VARCHAR(255) NOT NULL,
  image_url VARCHAR(1000) NOT NULL,
  channel_id BIGINT UNSIGNED NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_banners_channel FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE SET NULL
);

CREATE TABLE announcements (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  message TEXT NOT NULL,
  starts_at TIMESTAMP NULL,
  ends_at TIMESTAMP NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE stream_sessions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  channel_id BIGINT UNSIGNED NOT NULL,
  device_id VARCHAR(190) NULL,
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP NULL,
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_sessions_channel FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE,
  INDEX idx_sessions_active (ended_at)
);

CREATE TABLE rate_limits (
  rate_key CHAR(64) PRIMARY KEY,
  hits INT NOT NULL DEFAULT 0,
  window_start TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (name, slug, sort_order) VALUES ('News', 'news', 1), ('Sports', 'sports', 2), ('Kids', 'kids', 3), ('Documentary', 'documentary', 4);
-- Add only legal, licensed, or user-authorized stream URLs in production. No copyrighted or unauthorized stream URLs are seeded here.
