package com.makienkovs.tictactoe;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class WebActivity extends AppCompatActivity {

    WebAppInterface webAppInterface;

    @SuppressLint({"SetJavaScriptEnabled", "SourceLockedOrientationActivity"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_web);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        String url = getIntent().getStringExtra("URL");
        String sound = getIntent().getStringExtra("Sound");
        String vibration = getIntent().getStringExtra("Vibration");

        WebView webView = findViewById(R.id.web);
        webView.getSettings().setJavaScriptEnabled(true);

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
                return super.onJsAlert(view, url, message, result);
            }
        });

        webAppInterface = new WebAppInterface(this, sound, vibration);
        webView.addJavascriptInterface(webAppInterface, "Android");

        webView.loadUrl(url);
    }

    @Override
    protected void onStop() {
        super.onStop();
        webAppInterface.release();
    }

    @Override
    protected void onResume() {
        super.onResume();
        webAppInterface.initParams();
    }
}
