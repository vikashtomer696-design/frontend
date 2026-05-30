package com.streamvision.tv.ui

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val StreamVisionColors = darkColorScheme(
    primary = Color(0xFF8B5CF6),
    secondary = Color(0xFF00E5FF),
    background = Color(0xFF050713),
    surface = Color(0xFF10162A),
    onPrimary = Color.White,
    onBackground = Color(0xFFF8FBFF),
    onSurface = Color(0xFFF8FBFF)
)

@Composable
fun StreamVisionTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = StreamVisionColors, content = content)
}
