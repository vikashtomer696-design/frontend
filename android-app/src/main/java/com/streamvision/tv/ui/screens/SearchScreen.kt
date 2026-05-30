package com.streamvision.tv.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.streamvision.tv.data.Channel

@Composable
fun SearchScreen(results: List<Channel>, onQuery: (String) -> Unit, onVoiceSearch: () -> Unit, onPlay: (Channel) -> Unit) {
    var query by remember { mutableStateOf("") }
    Column(Modifier.fillMaxSize().background(Color(0xFF050713)).padding(40.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Text("Global search", fontSize = 34.sp, fontWeight = FontWeight.Black)
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            OutlinedTextField(query, { query = it; onQuery(it) }, label = { Text("Search channels, categories, EPG") })
            TvAction("Voice") { onVoiceSearch() }
        }
        ChannelRail("Instant results", results, onPlay)
    }
}
