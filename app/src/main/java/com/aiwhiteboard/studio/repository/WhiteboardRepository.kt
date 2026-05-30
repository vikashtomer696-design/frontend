package com.aiwhiteboard.studio.repository

import android.content.Context
import android.net.Uri
import com.aiwhiteboard.studio.api.ApiFactory
import com.aiwhiteboard.studio.models.*
import com.aiwhiteboard.studio.utils.SecureSettings
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.net.URL

class WhiteboardRepository(context: Context) {
    private val appContext = context.applicationContext
    private val settings = SecureSettings(appContext)
    private val api = ApiFactory.create(appContext)

    suspend fun login(email: String, password: String): LoginResponse = unwrap(api.login(LoginRequest(email, password))).also { settings.saveToken(it.token) }

    suspend fun buildProject(youtubeUrl: String, onProgress: suspend (Float, String) -> Unit): StoryResponse = withContext(Dispatchers.IO) {
        val token = bearer()
        onProgress(.12f, "Extracting YouTube transcript")
        val transcript = unwrap(api.transcript(token, AnalyzeRequest(youtubeUrl)))
        onProgress(.32f, "Analyzing storytelling structure")
        val story = unwrap(api.generateStory(token, StoryRequest(transcript.transcript, transcript.title, transcript.durationSeconds)))
        onProgress(.58f, "Generating original whiteboard drawings")
        story.scenes.forEachIndexed { index, scene ->
            runCatching { api.generateImage(token, ImageRequest(scene.drawingPrompt)) }
            onProgress(.58f + ((index + 1f) / story.scenes.size.coerceAtLeast(1)) * .18f, "Prepared scene ${index + 1}")
        }
        onProgress(.82f, "Creating AI voiceover")
        val voice = unwrap(api.generateVoice(token, VoiceRequest(story.narration)))
        downloadToCache(voice.audioUrl, "voiceover.mp3")
        onProgress(1f, "AI storyboard ready")
        story
    }

    suspend fun createVoice(text: String): Uri = withContext(Dispatchers.IO) {
        val voice = unwrap(api.generateVoice(bearer(), VoiceRequest(text)))
        Uri.fromFile(downloadToCache(voice.audioUrl, "preview_voice.mp3"))
    }

    private suspend fun bearer(): String {
        val value = settings.token()
        return if (value.isBlank()) "Bearer guest" else "Bearer $value"
    }

    private fun downloadToCache(url: String, name: String): File {
        val target = File(appContext.cacheDir, name)
        URL(url).openStream().use { input -> target.outputStream().use { output -> input.copyTo(output) } }
        return target
    }

    private fun <T> unwrap(envelope: ApiEnvelope<T>): T = if (envelope.ok && envelope.data != null) envelope.data else error(envelope.error ?: "Server returned an empty response")
}
