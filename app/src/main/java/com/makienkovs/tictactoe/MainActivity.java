package com.makienkovs.tictactoe;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.Switch;

public class MainActivity extends AppCompatActivity {

    private static boolean sound = true;
    private static boolean vibration = true;
    public static final String APP_PREFERENCES = "settings";
    public static final String APP_PREFERENCES_SOUND = "sound";
    public static final String APP_PREFERENCES_VIBRATION = "vibration";
    private SharedPreferences settings;
    private SharedPreferences.Editor editor;
    private Sound soundFX;
    private Vibration vibrationFX;
    int width;

    @SuppressLint({"SourceLockedOrientationActivity", "CommitPrefEdits"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        settings = getSharedPreferences(APP_PREFERENCES, Context.MODE_PRIVATE);
        editor = settings.edit();
        soundFX = new Sound(this, true);
        vibrationFX = new Vibration(this, true);
        readParams();
        DisplayMetrics displaymetrics = getResources().getDisplayMetrics();
        width = displaymetrics.widthPixels;
    }


    @Override
    protected void onStop() {
        super.onStop();
        soundFX.release();
        soundFX = null;
        writeParams();
    }

    @Override
    protected void onResume() {
        super.onResume();
        soundFX = new Sound(this, true);
        readParams();
    }

    private void readParams() {
        if (settings.contains(APP_PREFERENCES_SOUND)) {
            sound = settings.getBoolean(APP_PREFERENCES_SOUND, true);
            vibration = settings.getBoolean(APP_PREFERENCES_VIBRATION, true);
        }
    }

    private void writeParams() {
        editor.putBoolean(APP_PREFERENCES_SOUND, sound);
        editor.putBoolean(APP_PREFERENCES_VIBRATION, vibration);
        editor.apply();
    }

    public void changeActivity(View v) {
        final Animation animScale = AnimationUtils.loadAnimation(this, R.anim.scale);
        v.startAnimation(animScale);
        Button button = (Button) v;
        Intent web = new Intent(MainActivity.this, WebActivity.class);
        String buttonText = button.getText().toString();
        if (sound) {
            web.putExtra("Sound", "on");
            soundFX.play("tapSound");
        } else web.putExtra("Sound", "off");

        if (vibration) {
            web.putExtra("Vibration", "on");
            vibrationFX.vibrate(Vibration.VIBRATION_SHORT);
        } else web.putExtra("Vibration", "off");

        switch (buttonText) {
            case "Easy":
                web.putExtra("URL", "file:///android_asset/www/easy.html#1");
                startActivity(web);
                break;
            case "Hard":
                web.putExtra("URL", "file:///android_asset/www/hard.html#1");
                startActivity(web);
                break;
            case "Two players":
                web.putExtra("URL", "file:///android_asset/www/two.html#1");
                startActivity(web);
                break;
            case "Легко":
                web.putExtra("URL", "file:///android_asset/www/easy.html#2");
                startActivity(web);
                break;
            case "Трудно":
                web.putExtra("URL", "file:///android_asset/www/hard.html#2");
                startActivity(web);
                break;
            case "Два игрока":
                web.putExtra("URL", "file:///android_asset/www/two.html#2");
                startActivity(web);
                break;
        }
    }

    public void setSound() {
        sound = !sound;
        if (sound)
            soundFX.play("messageSound");
        else
            soundFX.play("tapSound");
    }

    public void setVibration() {
        vibration = !vibration;
        if (vibration)
            vibrationFX.vibrate(Vibration.VIBRATION_LONG);
        else
            vibrationFX.vibrate(Vibration.VIBRATION_SHORT);
    }

    public void settings(View v) {
        final Animation animScale = AnimationUtils.loadAnimation(this, R.anim.scale);
        v.startAnimation(animScale);

        if (sound)
            soundFX.play("tapSound");

        if (vibration)
            vibrationFX.vibrate(Vibration.VIBRATION_SHORT);

        final View settingsView = getLayoutInflater().inflate(R.layout.settings, null);
        final Switch soundSwitch = settingsView.findViewById(R.id.soundSwitch);
        soundSwitch.setChecked(sound);
        soundSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                setSound();
            }
        });

        final Switch vibrationSwitch = settingsView.findViewById(R.id.vibrationSwitch);
        vibrationSwitch.setChecked(vibration);
        vibrationSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                setVibration();
            }
        });

        new AlertDialog.Builder(this)
                .setTitle(getString(R.string.Settings))
                .setPositiveButton(R.string.Ok,
                        new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                sound = soundSwitch.isChecked();
                                vibration = vibrationSwitch.isChecked();
                                if (sound)
                                    soundFX.play("tapSound");
                                if (vibration)
                                    vibrationFX.vibrate(Vibration.VIBRATION_SHORT);
                            }
                        })
                .setView(settingsView)
                .setCancelable(false)
                .setIcon(R.drawable.settings)
                .create()
                .show();
    }
}