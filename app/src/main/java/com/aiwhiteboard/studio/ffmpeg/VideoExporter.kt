package com.aiwhiteboard.studio.ffmpeg

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import com.aiwhiteboard.studio.models.SketchType
import com.aiwhiteboard.studio.models.WhiteboardScene
import com.arthenica.ffmpegkit.FFmpegKit
import com.arthenica.ffmpegkit.ReturnCode
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import kotlin.math.max

class VideoExporter(private val context: Context) {
    suspend fun export(scenes: List<WhiteboardScene>, audioPath: String?, onProgress: suspend (Float, String) -> Unit): File = withContext(Dispatchers.IO) {
        val dir = File(context.cacheDir, "render_${System.currentTimeMillis()}").apply { mkdirs() }
        val frames = File(dir, "frames").apply { mkdirs() }
        val fps = 24
        var frameIndex = 0
        scenes.forEachIndexed { sIndex, scene ->
            val total = max(1, (scene.durationMs / 1000f * fps).toInt())
            repeat(total) { f ->
                val progress = f / total.toFloat()
                renderFrame(scene, progress).compress(Bitmap.CompressFormat.PNG, 92, File(frames, "frame_%05d.png".format(frameIndex++)).outputStream())
                onProgress((sIndex + f / total.toFloat()) / scenes.size * .72f, "Drawing scene ${sIndex + 1}")
            }
        }
        val output = File(context.getExternalFilesDir(null), "whiteboard_${System.currentTimeMillis()}.mp4")
        val cmd = buildString {
            append("-y -framerate $fps -i ${File(frames, "frame_%05d.png").absolutePath} ")
            if (!audioPath.isNullOrBlank()) append("-i $audioPath -shortest ")
            append("-c:v libx264 -pix_fmt yuv420p -movflags +faststart ${output.absolutePath}")
        }
        onProgress(.82f, "Encoding MP4 with FFmpeg")
        val session = FFmpegKit.execute(cmd)
        if (!ReturnCode.isSuccess(session.returnCode)) error(session.failStackTrace ?: "FFmpeg export failed with code ${session.returnCode}")
        onProgress(1f, "Saved ${output.name}")
        output
    }

    private fun renderFrame(scene: WhiteboardScene, progress: Float): Bitmap {
        val bitmap = Bitmap.createBitmap(1280, 720, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap).apply { drawColor(Color.rgb(253, 253, 248)) }
        val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.rgb(18,18,18); strokeWidth = 6f; style = Paint.Style.STROKE; strokeCap = Paint.Cap.ROUND; textSize = 34f }
        canvas.drawText(scene.title, 44f, 62f, Paint(paint).apply { style = Paint.Style.FILL; textSize = 38f; isFakeBoldText = true })
        scene.elements.forEach { element ->
            val local = ((progress * scene.durationMs - element.startDelayMs) / element.durationMs).coerceIn(0f, 1f)
            if (local <= 0f) return@forEach
            when (element.type) {
                SketchType.RECT -> if (element.points.size >= 4) canvas.drawRect(element.points[0], element.points[1], element.points[0] + element.points[2] * local, element.points[1] + element.points[3], paint)
                SketchType.CIRCLE -> if (element.points.size >= 3) canvas.drawCircle(element.points[0], element.points[1], element.points[2] * local, paint)
                SketchType.TEXT -> canvas.drawText(element.text, element.points.getOrElse(0) { 100f }, element.points.getOrElse(1) { 100f }, Paint(paint).apply { style = Paint.Style.FILL; alpha = (255 * local).toInt(); textSize = 32f })
                SketchType.PATH, SketchType.ARROW -> element.points.chunked(2).zipWithNext().take((element.points.size / 2 * local).toInt().coerceAtLeast(1)).forEach { (a,b) -> canvas.drawLine(a[0], a[1], b[0], b[1], paint) }
            }
        }
        return bitmap
    }
}
