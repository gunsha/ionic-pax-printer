package com.example.ionicpaxprinter;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState){
    registerPlugin(IntentPlugin.class);
    super.onCreate(savedInstanceState);
  }
}
