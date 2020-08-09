package com.makienkovs.tictactoe;

import android.content.Context;
import android.view.Gravity;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

public class WebAppInterface {
    private Context mContext;
    private String sound;
    private String vibration;
    private Sound soundFX;
    private Vibration vibrationFX;

    /** Instantiate the interface and set the context */
    WebAppInterface(Context c, String sound, String vibration) {
        mContext = c;
        this.sound = sound;
        this.vibration = vibration;

        initParams();
    }

    void initParams(){
        if (sound.equals("on"))
            soundFX = new Sound(mContext, true);
        else
            soundFX = new Sound(mContext, false);

        if (vibration.equals("on"))
            vibrationFX = new Vibration(mContext, true);
        else
            vibrationFX = new Vibration(mContext, false);
    }

    void release(){
        soundFX.release();
    }

    /** Show a toast from the web page */
    @JavascriptInterface
    public void showToast(String text) {
        Toast toast = Toast.makeText(mContext, text, Toast.LENGTH_SHORT);
        toast.setGravity(Gravity.CENTER, 0, 0);
        toast.show();
    }

    /** Make a vibration on web page */
    @JavascriptInterface
    public void vibrate(){
        vibrationFX.vibrate(Vibration.VIBRATION_SHORT);
    }

    /** Make a sound on web page */
    @JavascriptInterface
    public void play(String soundName){
        soundFX.play(soundName);
    }
}