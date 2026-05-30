package com.streamvision.tv.ui.screens

import android.view.ViewGroup
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.media3.ui.PlayerView
import com.streamvision.tv.data.Channel
import com.streamvision.tv.media.StreamVisionPlayer

@Composable
fun PlayerScreen(channel: Channel, onBackToGuide: () -> Unit) {
    val context = LocalContext.current
    val controller = remember { StreamVisionPlayer(context) }
    var message by remember { mutableStateOf<String?>(null) }

    DisposableEffect(channel.id) {
        controller.addErrorRecovery(
            onRecovered = { message = "Network recovered. Reconnecting…" },
            onFatal = { message = "Playback error: ${it.errorCodeName}" }
        )
        controller.play(channel)
        onDispose { controller.release() }
    }

    Box(Modifier.fillMaxSize().background(Color.Black)) {
        AndroidView(
            modifier = Modifier.fillMaxSize(),
            factory = {
                PlayerView(it).apply {
                    player = controller.player
                    useController = true
                    layoutParams = ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
                }
            }
        )
        Column(Modifier.align(Alignment.TopStart).padding(32.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(channel.name, color = Color.White)
            message?.let { Text(it, color = Color(0xFF00E5FF)) }
            TvAction("Guide") { onBackToGuide() }
        }
    }
}
