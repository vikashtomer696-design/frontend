package com.aiwhiteboard.studio.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.*
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.aiwhiteboard.studio.ui.theme.*

@Composable fun AnimatedBackground(content: @Composable BoxScope.() -> Unit) {
    val t by rememberInfiniteTransition(label = "bg").animateFloat(0f, 1f, infiniteRepeatable(tween(9000, easing = LinearEasing), RepeatMode.Reverse), label = "phase")
    Box(Modifier.fillMaxSize().background(DeepSpace)) {
        Canvas(Modifier.fillMaxSize()) {
            drawCircle(Brush.radialGradient(listOf(NeonCyan.copy(.32f), Color.Transparent)), radius = size.minDimension * .65f, center = Offset(size.width * (.2f + t * .18f), size.height * .18f))
            drawCircle(Brush.radialGradient(listOf(NeonPurple.copy(.28f), Color.Transparent)), radius = size.minDimension * .7f, center = Offset(size.width * (.86f - t * .12f), size.height * .78f))
        }
        content()
    }
}

@Composable fun GlassCard(modifier: Modifier = Modifier, content: @Composable ColumnScope.() -> Unit) {
    Column(modifier.clip(RoundedCornerShape(28.dp)).background(Glass).border(1.dp, Brush.linearGradient(listOf(NeonCyan.copy(.55f), NeonPurple.copy(.45f), Color.Transparent)), RoundedCornerShape(28.dp)).padding(20.dp), content = content)
}

@Composable fun GlowButton(text: String, modifier: Modifier = Modifier, enabled: Boolean = true, onClick: () -> Unit) {
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val pulse by rememberInfiniteTransition(label = "pulse").animateFloat(.65f, 1f, infiniteRepeatable(tween(1200), RepeatMode.Reverse), label = "pulse")
    Button(onClick = onClick, enabled = enabled, interactionSource = interaction, modifier = modifier.height(56.dp).scale(if (pressed) .96f else 1f).border(1.dp, NeonCyan.copy(alpha = pulse), RoundedCornerShape(18.dp)), shape = RoundedCornerShape(18.dp), colors = ButtonDefaults.buttonColors(containerColor = NeonPurple.copy(.78f))) {
        Text(text, fontWeight = FontWeight.Bold)
    }
}

@Composable fun AiThinkingLoader(label: String, progress: Float, modifier: Modifier = Modifier) {
    GlassCard(modifier) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            CircularProgressIndicator(progress = { progress.coerceIn(0f, 1f) }, color = NeonCyan, trackColor = Color.White.copy(.08f))
            Spacer(Modifier.width(16.dp))
            Column { Text("AI Thinking", fontWeight = FontWeight.Bold); Text(label, color = Color.White.copy(.75f)) }
        }
        Spacer(Modifier.height(12.dp))
        LinearProgressIndicator(progress = { progress.coerceIn(0f, 1f) }, modifier = Modifier.fillMaxWidth(), color = NeonCyan, trackColor = Color.White.copy(.08f))
    }
}

@Composable fun NeonTextField(value: String, onValueChange: (String) -> Unit, label: String, modifier: Modifier = Modifier, singleLine: Boolean = true) {
    OutlinedTextField(value = value, onValueChange = onValueChange, label = { Text(label) }, singleLine = singleLine, modifier = modifier.fillMaxWidth(), colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = NeonCyan, unfocusedBorderColor = NeonPurple.copy(.45f), focusedContainerColor = Color.White.copy(.04f), unfocusedContainerColor = Color.White.copy(.03f)), shape = RoundedCornerShape(18.dp))
}
