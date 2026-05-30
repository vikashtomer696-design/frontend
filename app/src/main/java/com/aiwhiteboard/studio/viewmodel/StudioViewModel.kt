package com.aiwhiteboard.studio.viewmodel

import android.app.Application
import android.net.Uri
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.aiwhiteboard.studio.ffmpeg.VideoExporter
import com.aiwhiteboard.studio.models.RenderRecord
import com.aiwhiteboard.studio.models.WhiteboardScene
import com.aiwhiteboard.studio.repository.WhiteboardRepository
import com.aiwhiteboard.studio.utils.SecureSettings
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class StudioViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = WhiteboardRepository(application)
    private val exporter = VideoExporter(application)
    private val settings = SecureSettings(application)
    private val _state = MutableStateFlow(StudioState())
    val state: StateFlow<StudioState> = _state.asStateFlow()

    init { viewModelScope.launch { _state.value = _state.value.copy(backendUrl = settings.backendUrl()) } }

    fun updateUrl(value: String) { _state.value = _state.value.copy(youtubeUrl = value, error = null) }
    fun updateBackend(value: String) { _state.value = _state.value.copy(backendUrl = value) }
    fun saveBackend() = viewModelScope.launch { settings.saveBackendUrl(_state.value.backendUrl) }
    fun login(email: String, password: String) = viewModelScope.launch {
        runTask("Signing in") { repository.login(email, password); _state.value = _state.value.copy(isLoggedIn = true) }
    }
    fun startWorkflow() = viewModelScope.launch {
        val url = _state.value.youtubeUrl.trim()
        if (!url.contains("youtube.com") && !url.contains("youtu.be")) { _state.value = _state.value.copy(error = "Paste a valid YouTube URL"); return@launch }
        _state.value = _state.value.copy(isProcessing = true, progress = 0f, progressLabel = "Starting AI pipeline", error = null)
        runCatching {
            repository.buildProject(url) { p, label -> _state.value = _state.value.copy(progress = p, progressLabel = label) }
        }.onSuccess { story ->
            _state.value = _state.value.copy(isProcessing = false, storyTitle = story.hook, narration = story.narration, scenes = story.scenes, selectedScene = story.scenes.firstOrNull(), progress = 1f, progressLabel = "Ready to preview")
        }.onFailure { _state.value = _state.value.copy(isProcessing = false, error = it.message ?: "AI workflow failed") }
    }
    fun selectScene(scene: WhiteboardScene) { _state.value = _state.value.copy(selectedScene = scene) }
    fun previewVoice() = viewModelScope.launch { runTask("Rendering voice preview") { _state.value = _state.value.copy(voicePreview = repository.createVoice(_state.value.narration)) } }
    fun exportVideo() = viewModelScope.launch {
        val scenes = _state.value.scenes
        if (scenes.isEmpty()) { _state.value = _state.value.copy(error = "Generate scenes before exporting"); return@launch }
        _state.value = _state.value.copy(isExporting = true, exportProgress = 0f, error = null)
        runCatching { exporter.export(scenes, null) { p, label -> _state.value = _state.value.copy(exportProgress = p, progressLabel = label) } }
            .onSuccess { file ->
                val record = RenderRecord(System.currentTimeMillis(), _state.value.storyTitle.ifBlank { "Whiteboard Video" }, file.absolutePath, System.currentTimeMillis())
                _state.value = _state.value.copy(isExporting = false, downloads = listOf(record) + _state.value.downloads, exportedVideo = Uri.fromFile(file), exportProgress = 1f)
            }.onFailure { _state.value = _state.value.copy(isExporting = false, error = it.message ?: "Export failed") }
    }
    private suspend fun runTask(label: String, block: suspend () -> Unit) {
        _state.value = _state.value.copy(isProcessing = true, progressLabel = label, error = null)
        runCatching { block() }.onFailure { _state.value = _state.value.copy(error = it.message ?: "Action failed") }
        _state.value = _state.value.copy(isProcessing = false)
    }
}

data class StudioState(
    val isLoggedIn: Boolean = true,
    val backendUrl: String = "",
    val youtubeUrl: String = "",
    val storyTitle: String = "",
    val narration: String = "",
    val scenes: List<WhiteboardScene> = emptyList(),
    val selectedScene: WhiteboardScene? = null,
    val isProcessing: Boolean = false,
    val isExporting: Boolean = false,
    val progress: Float = 0f,
    val exportProgress: Float = 0f,
    val progressLabel: String = "Idle",
    val error: String? = null,
    val voicePreview: Uri? = null,
    val exportedVideo: Uri? = null,
    val downloads: List<RenderRecord> = emptyList()
)
