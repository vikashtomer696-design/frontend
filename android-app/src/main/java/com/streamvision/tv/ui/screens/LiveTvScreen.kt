package com.streamvision.tv.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.streamvision.tv.data.Category
import com.streamvision.tv.data.Channel

@Composable
fun LiveTvScreen(categories: List<Category>, channels: List<Channel>, onPlay: (Channel) -> Unit, onFavorite: (Channel) -> Unit) {
    Column(Modifier.fillMaxSize().background(Color(0xFF050713)).padding(40.dp), verticalArrangement = Arrangement.spacedBy(24.dp)) {
        Text("Live TV", fontSize = 34.sp, fontWeight = FontWeight.Black)
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            categories.forEach { TvAction(it.name) {} }
        }
        ChannelRail("All authorized channels", channels, onPlay)
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            channels.firstOrNull()?.let { TvAction("Favorite ${it.name}") { onFavorite(it) } }
        }
    }
}
