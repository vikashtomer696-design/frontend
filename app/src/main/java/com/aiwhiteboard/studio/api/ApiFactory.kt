package com.aiwhiteboard.studio.api

import android.content.Context
import com.aiwhiteboard.studio.BuildConfig
import com.aiwhiteboard.studio.utils.SecureSettings
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.kotlinx.serialization.asConverterFactory
import okhttp3.MediaType.Companion.toMediaType
import java.util.concurrent.TimeUnit

object ApiFactory {
    private val json = Json { ignoreUnknownKeys = true; explicitNulls = false }
    fun create(context: Context): WhiteboardApi {
        val settings = SecureSettings(context)
        val baseUrl = runBlocking { settings.backendUrl() }.ifBlank { BuildConfig.DEFAULT_BACKEND_URL }
        val client = OkHttpClient.Builder()
            .connectTimeout(45, TimeUnit.SECONDS)
            .readTimeout(180, TimeUnit.SECONDS)
            .writeTimeout(180, TimeUnit.SECONDS)
            .addInterceptor { chain ->
                chain.proceed(chain.request().newBuilder()
                    .header("Accept", "application/json")
                    .header("Content-Type", "application/json")
                    .header("X-App-Version", BuildConfig.VERSION_NAME)
                    .build())
            }
            .addInterceptor(HttpLoggingInterceptor().apply { level = if (BuildConfig.DEBUG) HttpLoggingInterceptor.Level.BASIC else HttpLoggingInterceptor.Level.NONE })
            .build()
        return Retrofit.Builder().baseUrl(baseUrl.ensureSlash()).client(client)
            .addConverterFactory(json.asConverterFactory("application/json".toMediaType())).build().create(WhiteboardApi::class.java)
    }
    private fun String.ensureSlash() = if (endsWith('/')) this else "$this/"
}
