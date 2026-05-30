package com.streamvision.tv.data

data class UserSession(val token: String, val user: User, val expiresAt: String)
data class User(val id: Long, val name: String, val email: String?, val role: String, val avatarUrl: String?)
data class Category(val id: Long, val name: String, val slug: String, val sortOrder: Int)
data class Channel(
    val id: Long,
    val name: String,
    val streamUrl: String,
    val streamType: String,
    val logoUrl: String?,
    val epgId: String?,
    val category: Category?,
    val isFeatured: Boolean,
    val isFavorite: Boolean = false
)
data class Banner(val id: Long, val title: String, val subtitle: String, val imageUrl: String, val channelId: Long?)
data class WatchHistory(val channel: Channel, val watchedAt: String, val positionSeconds: Long)
data class AppSettings(val theme: String = "dark", val language: String = "en", val autoplay: Boolean = true, val preferredBitrate: Int? = null)
data class M3uImportResult(val total: Int, val channels: List<Channel>)
