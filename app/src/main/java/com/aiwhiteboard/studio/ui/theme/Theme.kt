package com.aiwhiteboard.studio.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val NeonCyan = Color(0xFF6EE7FF)
val NeonPurple = Color(0xFFA855F7)
val DeepSpace = Color(0xFF050713)
val Glass = Color(0x33243B55)
val Ink = Color(0xFF121212)

@Composable fun AIWhiteboardTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = darkColorScheme(primary = NeonCyan, secondary = NeonPurple, background = DeepSpace, surface = Color(0xFF0B1020), onPrimary = Color.Black, onSecondary = Color.White),
        typography = androidx.compose.material3.Typography(),
        content = content
    )
}
