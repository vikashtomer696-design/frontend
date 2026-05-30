package com.aiwhiteboard.studio.utils

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.aiwhiteboard.studio.BuildConfig
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

private val Context.settingsStore by preferencesDataStore("secure_runtime_settings")
class SecureSettings(private val context: Context) {
    private val backend = stringPreferencesKey("backend_url")
    private val token = stringPreferencesKey("token")
    suspend fun backendUrl(): String = context.settingsStore.data.map { it[backend] ?: BuildConfig.DEFAULT_BACKEND_URL }.first()
    suspend fun token(): String = context.settingsStore.data.map { it[token] ?: "" }.first()
    suspend fun saveBackendUrl(url: String) { context.settingsStore.edit { it[backend] = url.trim() } }
    suspend fun saveToken(value: String) { context.settingsStore.edit { it[token] = value } }
    suspend fun logout() { context.settingsStore.edit { it.remove(token) } }
}
