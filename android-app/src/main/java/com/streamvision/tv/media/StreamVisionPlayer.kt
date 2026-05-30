package com.streamvision.tv.media

import android.content.Context
import androidx.media3.common.C
import androidx.media3.common.MediaItem
import androidx.media3.common.PlaybackException
import androidx.media3.common.Player
import androidx.media3.common.TrackSelectionOverride
import androidx.media3.common.Tracks
import androidx.media3.datasource.DefaultHttpDataSource
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.dash.DashMediaSource
import androidx.media3.exoplayer.hls.HlsMediaSource
import androidx.media3.exoplayer.source.ProgressiveMediaSource
import androidx.media3.exoplayer.trackselection.DefaultTrackSelector
import com.streamvision.tv.data.Channel

class StreamVisionPlayer(context: Context) {
    private val httpFactory = DefaultHttpDataSource.Factory()
        .setConnectTimeoutMs(8_000)
        .setReadTimeoutMs(15_000)
        .setAllowCrossProtocolRedirects(true)
        .setUserAgent("StreamVisionTV/1.0")

    private val trackSelector = DefaultTrackSelector(context).apply {
        setParameters(buildUponParameters().setPreferredTextLanguage("en"))
    }

    val player: ExoPlayer = ExoPlayer.Builder(context)
        .setTrackSelector(trackSelector)
        .build()

    fun play(channel: Channel) {
        val item = MediaItem.Builder()
            .setUri(channel.streamUrl)
            .setMediaId(channel.id.toString())
            .setTag(channel)
            .build()
        val source = when (channel.streamType.lowercase()) {
            "dash" -> DashMediaSource.Factory(httpFactory).createMediaSource(item)
            "hls" -> HlsMediaSource.Factory(httpFactory).setAllowChunklessPreparation(true).createMediaSource(item)
            else -> ProgressiveMediaSource.Factory(httpFactory).createMediaSource(item)
        }
        player.setMediaSource(source)
        player.prepare()
        player.playWhenReady = true
    }

    fun setPlaybackSpeed(speed: Float) { player.setPlaybackSpeed(speed) }
    fun selectAudioTrack(groupIndex: Int, trackIndex: Int, tracks: Tracks) = overrideTrack(C.TRACK_TYPE_AUDIO, groupIndex, trackIndex, tracks)
    fun selectSubtitleTrack(groupIndex: Int, trackIndex: Int, tracks: Tracks) = overrideTrack(C.TRACK_TYPE_TEXT, groupIndex, trackIndex, tracks)

    fun addErrorRecovery(onRecovered: () -> Unit, onFatal: (PlaybackException) -> Unit) {
        player.addListener(object : Player.Listener {
            override fun onPlayerError(error: PlaybackException) {
                if (error.errorCode == PlaybackException.ERROR_CODE_IO_NETWORK_CONNECTION_FAILED) {
                    player.prepare()
                    player.play()
                    onRecovered()
                } else {
                    onFatal(error)
                }
            }
        })
    }

    private fun overrideTrack(type: Int, groupIndex: Int, trackIndex: Int, tracks: Tracks) {
        val group = tracks.groups.filter { it.type == type }.getOrNull(groupIndex) ?: return
        val override = TrackSelectionOverride(group.mediaTrackGroup, listOf(trackIndex))
        trackSelector.setParameters(trackSelector.buildUponParameters().setOverrideForType(override))
    }

    fun release() = player.release()
}
