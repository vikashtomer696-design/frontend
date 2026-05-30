package com.streamvision.tv.ui.screens

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.focusable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.streamvision.tv.data.Channel
import com.streamvision.tv.data.HomePayload

@Composable
fun HomeScreen(payload: HomePayload, onPlay: (Channel) -> Unit, onSearch: () -> Unit, onSettings: () -> Unit) {
    Column(
        Modifier
            .fillMaxSize()
            .background(Color(0xFF050713))
            .padding(40.dp),
        verticalArrangement = Arrangement.spacedBy(28.dp)
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            Text("StreamVision TV", fontSize = 32.sp, fontWeight = FontWeight.Bold)
            TvAction("Search", onSearch)
            TvAction("Settings", onSettings)
        }
        HeroBanner(payload.featured.firstOrNull(), onPlay)
        ChannelRail("Featured channels", payload.featured, onPlay)
        ChannelRail("Trending now", payload.trending, onPlay)
        ChannelRail("Recently watched", payload.recentlyWatched.map { it.channel }, onPlay)
    }
}

@Composable
private fun HeroBanner(channel: Channel?, onPlay: (Channel) -> Unit) {
    Box(
        Modifier
            .fillMaxWidth()
            .height(260.dp)
            .clip(RoundedCornerShape(34.dp))
            .background(Brush.horizontalGradient(listOf(Color(0xFF25124D), Color(0xFF071827))))
            .padding(32.dp)
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
            Text("Live now", color = Color(0xFF00E5FF), fontWeight = FontWeight.Bold)
            Text(channel?.name ?: "Add authorized channels", fontSize = 42.sp, fontWeight = FontWeight.Black)
            Text("HLS/DASH adaptive playback, EPG metadata, favorites, and instant remote navigation.", color = Color(0xFFB8C1D6))
            if (channel != null) TvAction("Watch live") { onPlay(channel) }
        }
    }
}

@Composable
fun ChannelRail(title: String, channels: List<Channel>, onPlay: (Channel) -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text(title, fontSize = 24.sp, fontWeight = FontWeight.Bold)
        LazyRow(horizontalArrangement = Arrangement.spacedBy(18.dp)) {
            items(channels, key = { it.id }) { channel -> ChannelCard(channel, onPlay) }
        }
    }
}

@Composable
fun ChannelCard(channel: Channel, onPlay: (Channel) -> Unit) {
    var focused by remember { mutableStateOf(false) }
    val border by animateColorAsState(if (focused) Color(0xFF00E5FF) else Color.Transparent, label = "focus")
    Card(
        onClick = { onPlay(channel) },
        modifier = Modifier
            .width(230.dp)
            .height(150.dp)
            .onFocusChanged { focused = it.isFocused }
            .focusable()
            .border(BorderStroke(2.dp, border), RoundedCornerShape(22.dp)),
        colors = CardDefaults.cardColors(containerColor = Color(0xB31A2340))
    ) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            AsyncImage(model = channel.logoUrl, contentDescription = channel.name, modifier = Modifier.size(52.dp))
            Text(channel.name, fontWeight = FontWeight.Bold, maxLines = 2)
            Text(channel.category?.name ?: channel.streamType.uppercase(), color = Color(0xFF9AA7BF), fontSize = 12.sp)
        }
    }
}

@Composable
fun TvAction(label: String, onClick: () -> Unit) {
    Button(onClick = onClick, shape = RoundedCornerShape(14.dp)) { Text(label, fontWeight = FontWeight.Bold) }
}
