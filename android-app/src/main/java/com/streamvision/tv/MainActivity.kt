package com.streamvision.tv

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import com.streamvision.tv.data.*
import com.streamvision.tv.ui.StreamVisionTheme
import com.streamvision.tv.ui.screens.HomeScreen
import com.streamvision.tv.ui.screens.PlayerScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val demoCategory = Category(1, "News", "news", 1)
        val demoChannels = listOf(
            Channel(1, "Authorized News HD", "https://your-authorized-cdn.example/live/news.m3u8", "hls", null, "news.hd", demoCategory, true),
            Channel(2, "Public Access Demo", "https://your-authorized-cdn.example/live/public-access.mpd", "dash", null, "public.demo", demoCategory, true)
        )
        val payload = HomePayload(
            banners = emptyList(),
            featured = demoChannels,
            trending = demoChannels.reversed(),
            recentlyWatched = demoChannels.take(1).map { WatchHistory(it, "now", 0) },
            categories = listOf(demoCategory)
        )

        setContent {
            StreamVisionTheme {
                var playing by remember { mutableStateOf<Channel?>(null) }
                playing?.let { channel -> PlayerScreen(channel) { playing = null } }
                    ?: HomeScreen(payload, onPlay = { playing = it }, onSearch = {}, onSettings = {})
            }
        }
    }
}
