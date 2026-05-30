package com.aiwhiteboard.studio.animations

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.nativeCanvas
import com.aiwhiteboard.studio.models.SketchElement
import com.aiwhiteboard.studio.models.SketchType
import com.aiwhiteboard.studio.models.WhiteboardScene
import kotlin.math.min

@Composable fun WhiteboardScenePlayer(scene: WhiteboardScene?, modifier: Modifier = Modifier) {
    val progress by rememberInfiniteTransition(label = "scene").animateFloat(0f, 1f, infiniteRepeatable(tween((scene?.durationMs ?: 5000).toInt(), easing = LinearEasing), RepeatMode.Restart), label = "draw")
    Canvas(modifier.fillMaxSize().background(Color(0xFFFDFDF8))) { scene?.let { drawScene(it, progress) } }
}

fun androidx.compose.ui.graphics.drawscope.DrawScope.drawScene(scene: WhiteboardScene, progress: Float) {
    val sx = size.width / 1280f
    val sy = size.height / 720f
    scene.elements.forEachIndexed { index, element ->
        val local = ((progress * scene.durationMs - element.startDelayMs) / element.durationMs).coerceIn(0f, 1f)
        if (local > 0f) drawElement(element, local, sx, sy, index)
    }
    drawContext.canvas.nativeCanvas.apply {
        val paint = android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG).apply { color = android.graphics.Color.rgb(20,20,20); textSize = 34f * min(sx, sy); typeface = android.graphics.Typeface.create(android.graphics.Typeface.SANS_SERIF, android.graphics.Typeface.BOLD) }
        drawText(scene.title, 44f * sx, 62f * sy, paint)
    }
}

private fun androidx.compose.ui.graphics.drawscope.DrawScope.drawElement(element: SketchElement, progress: Float, sx: Float, sy: Float, index: Int) {
    val color = Color(element.strokeColor.toULong())
    val stroke = Stroke(width = 5f * min(sx, sy), cap = StrokeCap.Round, join = StrokeJoin.Round)
    when (element.type) {
        SketchType.PATH, SketchType.ARROW -> {
            val pts = element.points.chunked(2).map { Offset(it[0] * sx, it[1] * sy) }
            if (pts.size > 1) {
                val reveal = (pts.size * progress).toInt().coerceAtLeast(2).coerceAtMost(pts.size)
                val path = Path().apply { moveTo(pts.first().x, pts.first().y); pts.take(reveal).drop(1).forEach { lineTo(it.x, it.y) } }
                drawPath(path, color, style = stroke)
                if (element.type == SketchType.ARROW && progress > .8f) drawCircle(Color(element.accentColor.toULong()), 9f * min(sx, sy), pts.last())
            }
        }
        SketchType.RECT -> if (element.points.size >= 4) drawRect(color, Offset(element.points[0] * sx, element.points[1] * sy), androidx.compose.ui.geometry.Size(element.points[2] * sx * progress, element.points[3] * sy), style = stroke)
        SketchType.CIRCLE -> if (element.points.size >= 3) drawCircle(color, radius = element.points[2] * min(sx, sy) * progress, center = Offset(element.points[0] * sx, element.points[1] * sy), style = stroke)
        SketchType.TEXT -> drawContext.canvas.nativeCanvas.apply {
            val paint = android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG).apply { this.color = android.graphics.Color.rgb(18,18,18); alpha = (255 * progress).toInt(); textSize = 30f * min(sx, sy) }
            drawText(element.text, (element.points.getOrNull(0) ?: 100f) * sx, (element.points.getOrNull(1) ?: 100f) * sy, paint)
        }
    }
}
