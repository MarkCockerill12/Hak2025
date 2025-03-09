if (!next_sound_ready && !audio_is_playing(sound_Victory)) {
    // Victory sound has finished playing
    audio_play_sound(sound_alwaysSunny, 0, true, 1.0, undefined, 1.0);
    next_sound_ready = true; // Ensures we only play the next track once
}