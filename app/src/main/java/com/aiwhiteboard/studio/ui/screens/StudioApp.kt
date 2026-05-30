package com.aiwhiteboard.studio.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.animation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.aiwhiteboard.studio.animations.WhiteboardScenePlayer
import com.aiwhiteboard.studio.models.WhiteboardScene
import com.aiwhiteboard.studio.ui.components.*
import com.aiwhiteboard.studio.ui.theme.NeonCyan
import com.aiwhiteboard.studio.viewmodel.StudioState
import com.aiwhiteboard.studio.viewmodel.StudioViewModel

enum class Screen(val label: String) { Splash("Splash"), Onboarding("Onboarding"), Login("Login"), Home("Home"), Input("Create"), Processing("AI"), Scenes("Scenes"), Voice("Voice"), Animation("Preview"), Export("Export"), Downloads("Downloads"), Settings("Settings") }

@Composable fun StudioApp(state: StudioState, vm: StudioViewModel) {
    var screen by remember { mutableStateOf(Screen.Splash) }
    LaunchedEffect(Unit) { kotlinx.coroutines.delay(900); screen = Screen.Onboarding }
    LaunchedEffect(state.isProcessing) { if (state.isProcessing) screen = Screen.Processing }
    LaunchedEffect(state.scenes.size) { if (state.scenes.isNotEmpty()) screen = Screen.Scenes }
    AnimatedBackground {
        Column(Modifier.fillMaxSize().systemBarsPadding().padding(16.dp)) {
            if (screen !in listOf(Screen.Splash, Screen.Onboarding, Screen.Login)) NavBar(screen) { screen = it }
            AnimatedContent(screen, label = "screen") { active ->
                when (active) {
                    Screen.Splash -> SplashScreen()
                    Screen.Onboarding -> OnboardingScreen { screen = Screen.Home }
                    Screen.Login -> LoginScreen(vm) { screen = Screen.Home }
                    Screen.Home -> HomeDashboard(state) { screen = it }
                    Screen.Input -> YoutubeInputScreen(state, vm)
                    Screen.Processing -> ProcessingScreen(state)
                    Screen.Scenes -> ScenePreviewScreen(state, vm) { screen = Screen.Animation }
                    Screen.Voice -> VoicePreviewScreen(state, vm)
                    Screen.Animation -> AnimationPreviewScreen(state)
                    Screen.Export -> ExportScreen(state, vm)
                    Screen.Downloads -> DownloadsScreen(state)
                    Screen.Settings -> SettingsScreen(state, vm)
                }
            }
        }
        state.error?.let { Snackbar(Modifier.align(Alignment.BottomCenter).padding(20.dp)) { Text(it) } }
    }
}

@Composable private fun NavBar(screen: Screen, onSelect: (Screen) -> Unit) = LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth().padding(bottom = 14.dp)) {
    items(listOf(Screen.Home, Screen.Input, Screen.Scenes, Screen.Voice, Screen.Animation, Screen.Export, Screen.Downloads, Screen.Settings)) { item ->
        FilterChip(selected = screen == item, onClick = { onSelect(item) }, label = { Text(item.label) })
    }
}

@Composable private fun SplashScreen() = Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { Text("AI Whiteboard Studio", style = MaterialTheme.typography.displaySmall, fontWeight = FontWeight.Black, color = NeonCyan) }
@Composable private fun OnboardingScreen(onStart: () -> Unit) = CenterCard { Text("Create cinematic whiteboard videos from YouTube inspiration", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold); Text("The app extracts structure, generates an original script, builds scenes, creates voiceover, animates marker strokes, and exports MP4 on device."); Spacer(Modifier.height(18.dp)); GlowButton("Launch Studio", Modifier.fillMaxWidth(), onClick = onStart) }
@Composable private fun LoginScreen(vm: StudioViewModel, onDone: () -> Unit) { var email by remember { mutableStateOf("") }; var pass by remember { mutableStateOf("") }; CenterCard { NeonTextField(email, { email = it }, "Email"); NeonTextField(pass, { pass = it }, "Password"); GlowButton("Secure Login", Modifier.fillMaxWidth()) { vm.login(email, pass); onDone() } } }
@Composable private fun HomeDashboard(state: StudioState, open: (Screen) -> Unit) = LazyColumn(verticalArrangement = Arrangement.spacedBy(14.dp)) { item { Text("Production AI Video Pipeline", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Black); Text(state.progressLabel) }; items(listOf(Screen.Input, Screen.Scenes, Screen.Voice, Screen.Animation, Screen.Export, Screen.Downloads)) { s -> GlassCard(Modifier.fillMaxWidth()) { Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) { Column { Text(s.label, fontWeight = FontWeight.Bold); Text(featureCopy(s), color = MaterialTheme.colorScheme.onSurface.copy(.7f)) }; GlowButton("Open") { open(s) } } } } }
private fun featureCopy(s: Screen) = when (s) { Screen.Input -> "Paste YouTube URL and run AI analysis"; Screen.Scenes -> "Review generated whiteboard storyboard"; Screen.Voice -> "Generate and preview ElevenLabs narration"; Screen.Animation -> "Watch hand-drawn Canvas animation"; Screen.Export -> "Render synchronized MP4 via FFmpeg"; else -> "Saved videos and project outputs" }
@Composable private fun YoutubeInputScreen(state: StudioState, vm: StudioViewModel) = CenterCard { Text("YouTube Analyzer", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold); NeonTextField(state.youtubeUrl, vm::updateUrl, "https://www.youtube.com/watch?v=..."); GlowButton("Generate Whiteboard Video", Modifier.fillMaxWidth(), enabled = !state.isProcessing) { vm.startWorkflow() } }
@Composable private fun ProcessingScreen(state: StudioState) = CenterCard { AiThinkingLoader(state.progressLabel, state.progress, Modifier.fillMaxWidth()); Text("Analyzing emotional pacing, hook style, narration tone, engagement structure, and scene timing.") }
@Composable private fun ScenePreviewScreen(state: StudioState, vm: StudioViewModel, preview: () -> Unit) = RowPane { SceneList(state.scenes, vm::selectScene); GlassCard(Modifier.weight(1f).fillMaxHeight()) { Box(Modifier.fillMaxWidth().height(260.dp)) { WhiteboardScenePlayer(state.selectedScene) }; Text(state.selectedScene?.narration.orEmpty()); GlowButton("Preview Animation", Modifier.fillMaxWidth(), onClick = preview) } }
@Composable private fun VoicePreviewScreen(state: StudioState, vm: StudioViewModel) = CenterCard { Text("AI Voiceover", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold); Text(state.narration.ifBlank { "Generate a project first." }); GlowButton("Create Voice Preview", Modifier.fillMaxWidth()) { vm.previewVoice() }; state.voicePreview?.let { Text("Voice saved: $it") } }
@Composable private fun AnimationPreviewScreen(state: StudioState) = GlassCard(Modifier.fillMaxSize()) { Text("Canvas Whiteboard Animation", fontWeight = FontWeight.Bold); Box(Modifier.fillMaxWidth().weight(1f)) { WhiteboardScenePlayer(state.selectedScene ?: state.scenes.firstOrNull()) } }
@Composable private fun ExportScreen(state: StudioState, vm: StudioViewModel) = CenterCard { Text("MP4 Export", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold); if (state.isExporting) AiThinkingLoader(state.progressLabel, state.exportProgress, Modifier.fillMaxWidth()); GlowButton("Render MP4", Modifier.fillMaxWidth(), enabled = !state.isExporting) { vm.exportVideo() }; state.exportedVideo?.let { Text("Exported: $it") } }
@Composable private fun DownloadsScreen(state: StudioState) { val context = LocalContext.current; LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) { items(state.downloads) { d -> GlassCard(Modifier.fillMaxWidth()) { Text(d.title, fontWeight = FontWeight.Bold); Text(d.outputPath); GlowButton("Open Video") { context.startActivity(Intent(Intent.ACTION_VIEW).setDataAndType(Uri.parse(d.outputPath), "video/mp4").addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)) } } } } }
@Composable private fun SettingsScreen(state: StudioState, vm: StudioViewModel) = CenterCard { Text("InfinityFree Backend", fontWeight = FontWeight.Bold); NeonTextField(state.backendUrl, vm::updateBackend, "Backend URL"); GlowButton("Save Backend", Modifier.fillMaxWidth()) { vm.saveBackend() }; Text("Keep OpenRouter, Pollinations, and ElevenLabs keys only in PHP config on hosting.") }

@Composable private fun CenterCard(content: @Composable ColumnScope.() -> Unit) = Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { GlassCard(Modifier.fillMaxWidth().widthIn(max = 760.dp), content) }
@Composable private fun RowPane(content: @Composable RowScope.() -> Unit) = Row(Modifier.fillMaxSize(), horizontalArrangement = Arrangement.spacedBy(14.dp), content = content)
@Composable private fun SceneList(scenes: List<WhiteboardScene>, select: (WhiteboardScene) -> Unit) = LazyColumn(Modifier.widthIn(min = 220.dp, max = 330.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) { items(scenes) { scene -> GlassCard(Modifier.fillMaxWidth()) { Text(scene.title, fontWeight = FontWeight.Bold); Text("${scene.durationMs / 1000}s"); GlowButton("Select", Modifier.fillMaxWidth()) { select(scene) } } } }
