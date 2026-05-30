package com.streamvision.tv.data

import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

data class LoginRequest(val email: String, val password: String)
data class GoogleSignInRequest(val idToken: String)
data class M3uUrlRequest(val url: String, val epgUrl: String? = null)
data class FavoriteRequest(val channelId: Long)
data class WatchHistoryRequest(val channelId: Long, val positionSeconds: Long)

interface ApiService {
    @POST("auth/login") suspend fun login(@Body request: LoginRequest): UserSession
    @POST("auth/google") suspend fun googleSignIn(@Body request: GoogleSignInRequest): UserSession
    @POST("auth/guest") suspend fun guest(): UserSession

    @GET("channels") suspend fun channels(
        @Header("Authorization") bearer: String,
        @Query("category") category: String? = null,
        @Query("q") query: String? = null
    ): List<Channel>

    @GET("home") suspend fun home(@Header("Authorization") bearer: String): HomePayload
    @POST("favorites") suspend fun addFavorite(@Header("Authorization") bearer: String, @Body request: FavoriteRequest)
    @POST("history") suspend fun saveHistory(@Header("Authorization") bearer: String, @Body request: WatchHistoryRequest)
    @POST("m3u/import-url") suspend fun importM3uUrl(@Header("Authorization") bearer: String, @Body request: M3uUrlRequest): M3uImportResult
    @GET("channels/{id}") suspend fun channel(@Header("Authorization") bearer: String, @Path("id") id: Long): Channel
}

data class HomePayload(
    val banners: List<Banner>,
    val featured: List<Channel>,
    val trending: List<Channel>,
    val recentlyWatched: List<WatchHistory>,
    val categories: List<Category>
)
