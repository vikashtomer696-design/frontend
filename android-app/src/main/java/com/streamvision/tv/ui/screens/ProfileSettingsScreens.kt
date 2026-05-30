package com.streamvision.tv.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.streamvision.tv.data.AppSettings
import com.streamvision.tv.data.User

@Composable
fun ProfileScreen(user: User, onManagePlaylists: () -> Unit, onLogout: () -> Unit) {
    Column(Modifier.fillMaxSize().background(Color(0xFF050713)).padding(40.dp), verticalArrangement = Arrangement.spacedBy(18.dp)) {
        Text("Profile", fontSize = 34.sp, fontWeight = FontWeight.Black)
        Text(user.name)
        Text(user.email ?: "Guest account", color = Color(0xFF9AA7BF))
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            TvAction("M3U playlists") { onManagePlaylists() }
            TvAction("Log out") { onLogout() }
        }
    }
}

@Composable
fun SettingsScreen(settings: AppSettings, onSettingsChanged: (AppSettings) -> Unit, onClearCache: () -> Unit) {
    var autoplay by remember(settings.autoplay) { mutableStateOf(settings.autoplay) }
    Column(Modifier.fillMaxSize().background(Color(0xFF050713)).padding(40.dp), verticalArrangement = Arrangement.spacedBy(18.dp)) {
        Text("Settings", fontSize = 34.sp, fontWeight = FontWeight.Black)
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Text("Autoplay next authorized stream")
            Switch(autoplay, { autoplay = it; onSettingsChanged(settings.copy(autoplay = it)) })
        }
        TvAction("Dark theme") { onSettingsChanged(settings.copy(theme = "dark")) }
        TvAction("English") { onSettingsChanged(settings.copy(language = "en")) }
        TvAction("Clear image/API cache") { onClearCache() }
    }
}
