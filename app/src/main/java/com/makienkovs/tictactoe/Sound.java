package com.makienkovs.tictactoe;

import android.content.Context;
import android.media.AudioAttributes;
import android.media.SoundPool;

class Sound {
    private boolean sound;
    private SoundPool sounds;
    private int winSound;
    private int loseSound;
    private int tapSound;
    private int messageSound;
    private int moveSound;
    private Context context;

    Sound(Context context, boolean sound) {
        this.context = context;
        this.sound = sound;
        createSoundPool();
    }

    private void createSoundPool() {
        AudioAttributes attributes = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_MEDIA)
                .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                .build();
        sounds = new SoundPool.Builder()
                .setAudioAttributes(attributes)
                .setMaxStreams(10)
                .build();

        winSound = sounds.load(context, R.raw.win, 1);
        loseSound = sounds.load(context, R.raw.lose, 1);
        tapSound = sounds.load(context, R.raw.tap, 2);
        messageSound = sounds.load(context, R.raw.message, 1);
        moveSound = sounds.load(context, R.raw.move, 1);
    }

    void play(String soundName) {
        int s;
        switch (soundName){
            case "winSound": s = winSound; break;
            case "loseSound": s = loseSound; break;
            case "tapSound": s = tapSound; break;
            case "messageSound": s = messageSound; break;
            case "moveSound": s = moveSound; break;
            default:
                throw new IllegalStateException("Unexpected value: " + soundName);
        }

        if (s > 0 && sound) {
            float volume = 1;
            try {
                sounds.play(s, volume, volume, 1, 0, 1);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    void release() {
        sounds.release();
        sounds = null;
    }
}
