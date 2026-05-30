package com.aiwhiteboard.studio

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import com.aiwhiteboard.studio.ui.screens.StudioApp
import com.aiwhiteboard.studio.ui.theme.AIWhiteboardTheme
import com.aiwhiteboard.studio.viewmodel.StudioViewModel

class MainActivity : ComponentActivity() {
    private val viewModel by viewModels<StudioViewModel>()
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { AIWhiteboardTheme { val state by viewModel.state.collectAsState(); StudioApp(state, viewModel) } }
    }
}
