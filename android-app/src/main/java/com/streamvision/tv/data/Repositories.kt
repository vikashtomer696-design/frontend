package com.streamvision.tv.data

class AuthRepository(private val api: ApiService) {
    private var session: UserSession? = null
    val bearer: String get() = "Bearer ${session?.token.orEmpty()}"

    suspend fun login(email: String, password: String) = api.login(LoginRequest(email, password)).also { session = it }
    suspend fun googleSignIn(idToken: String) = api.googleSignIn(GoogleSignInRequest(idToken)).also { session = it }
    suspend fun continueAsGuest() = api.guest().also { session = it }
}

class ChannelRepository(private val api: ApiService, private val auth: AuthRepository) {
    private var cachedHome: HomePayload? = null

    suspend fun home(force: Boolean = false): HomePayload {
        if (!force) cachedHome?.let { return it }
        return api.home(auth.bearer).also { cachedHome = it }
    }

    suspend fun search(query: String): List<Channel> = api.channels(auth.bearer, query = query)
    suspend fun category(slug: String): List<Channel> = api.channels(auth.bearer, category = slug)
    suspend fun favorite(channelId: Long) = api.addFavorite(auth.bearer, FavoriteRequest(channelId))
    suspend fun saveProgress(channelId: Long, positionSeconds: Long) = api.saveHistory(auth.bearer, WatchHistoryRequest(channelId, positionSeconds))
    suspend fun importM3uUrl(url: String, epgUrl: String?) = api.importM3uUrl(auth.bearer, M3uUrlRequest(url, epgUrl))
}
