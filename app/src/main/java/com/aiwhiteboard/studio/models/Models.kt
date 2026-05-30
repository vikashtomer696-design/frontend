package com.aiwhiteboard.studio.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable data class ApiEnvelope<T>(val ok: Boolean, val data: T? = null, val error: String? = null)
@Serializable data class LoginRequest(val email: String, val password: String)
@Serializable data class LoginResponse(val token: String, val userId: String, val displayName: String)
@Serializable data class AnalyzeRequest(@SerialName("youtube_url") val youtubeUrl: String, val language: String = "en")
@Serializable data class TranscriptResponse(val title: String, val transcript: String, val durationSeconds: Int)
@Serializable data class StoryRequest(val transcript: String, val title: String, val durationSeconds: Int)
@Serializable data class StoryResponse(val narration: String, val tone: String, val hook: String, val scenes: List<WhiteboardScene>)
@Serializable data class VoiceRequest(val text: String, val voiceId: String = "21m00Tcm4TlvDq8ikWAM")
@Serializable data class VoiceResponse(@SerialName("audio_url") val audioUrl: String, val bytes: Int)
@Serializable data class ImageRequest(val prompt: String, val width: Int = 1280, val height: Int = 720)
@Serializable data class ImageResponse(@SerialName("image_url") val imageUrl: String)
@Serializable data class RenderRecord(val id: Long, val title: String, val outputPath: String, val createdAt: Long)

@Serializable
data class WhiteboardScene(
    val id: String,
    val title: String,
    val narration: String,
    val drawingPrompt: String,
    val durationMs: Long,
    val elements: List<SketchElement>
)

@Serializable
data class SketchElement(
    val type: SketchType,
    val points: List<Float>,
    val text: String = "",
    val strokeColor: Long = 0xFF151515,
    val accentColor: Long = 0xFF00D9FF,
    val startDelayMs: Long = 0,
    val durationMs: Long = 900
)

@Serializable enum class SketchType { PATH, RECT, CIRCLE, TEXT, ARROW }
