package com.streamvision.tv.util

import com.streamvision.tv.data.Category
import com.streamvision.tv.data.Channel

object M3uParser {
    private val attributeRegex = Regex("""([\w-]+)=\"([^\"]*)\"""")

    fun parse(content: String): List<Channel> {
        val lines = content.lineSequence().map { it.trim() }.filter { it.isNotBlank() }.toList()
        val channels = mutableListOf<Channel>()
        var index = 1L
        var pendingName = "Untitled Channel"
        var pendingLogo: String? = null
        var pendingGroup: String? = null
        var pendingEpgId: String? = null

        for (line in lines) {
            if (line.startsWith("#EXTINF", ignoreCase = true)) {
                val attrs = attributeRegex.findAll(line).associate { it.groupValues[1] to it.groupValues[2] }
                pendingLogo = attrs["tvg-logo"]
                pendingGroup = attrs["group-title"]
                pendingEpgId = attrs["tvg-id"]
                pendingName = line.substringAfterLast(',', attrs["tvg-name"] ?: pendingName).trim().ifEmpty { attrs["tvg-name"] ?: pendingName }
            } else if (!line.startsWith("#")) {
                val category = pendingGroup?.let { Category(index, it, it.lowercase().replace(" ", "-"), 0) }
                channels += Channel(
                    id = index++,
                    name = pendingName,
                    streamUrl = line,
                    streamType = when {
                        line.contains(".mpd", true) -> "dash"
                        line.contains(".m3u8", true) -> "hls"
                        else -> "progressive"
                    },
                    logoUrl = pendingLogo,
                    epgId = pendingEpgId,
                    category = category,
                    isFeatured = false
                )
                pendingName = "Untitled Channel"
                pendingLogo = null
                pendingGroup = null
                pendingEpgId = null
            }
        }
        return channels
    }
}
