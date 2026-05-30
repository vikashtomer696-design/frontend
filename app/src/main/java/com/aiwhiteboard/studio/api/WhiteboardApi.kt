package com.aiwhiteboard.studio.api

import com.aiwhiteboard.studio.models.*
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST

interface WhiteboardApi {
    @POST("login.php") suspend fun login(@Body request: LoginRequest): ApiEnvelope<LoginResponse>
    @POST("transcript.php") suspend fun transcript(@Header("Authorization") token: String, @Body request: AnalyzeRequest): ApiEnvelope<TranscriptResponse>
    @POST("openrouter.php") suspend fun generateStory(@Header("Authorization") token: String, @Body request: StoryRequest): ApiEnvelope<StoryResponse>
    @POST("pollinations.php") suspend fun generateImage(@Header("Authorization") token: String, @Body request: ImageRequest): ApiEnvelope<ImageResponse>
    @POST("voice.php") suspend fun generateVoice(@Header("Authorization") token: String, @Body request: VoiceRequest): ApiEnvelope<VoiceResponse>
}
