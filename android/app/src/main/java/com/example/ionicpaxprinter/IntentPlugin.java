package com.example.ionicpaxprinter;

import android.content.Intent;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "IntentPlugin")
public class IntentPlugin extends Plugin {
  @PluginMethod
  public void startActivity(PluginCall call) {
    String intent = call.getString("intent");
    if (intent == null || intent.isEmpty()) {
      call.reject("Intent is required");
      return;
    }
    Intent intentObj = new Intent(intent);
    this.getActivity().startActivity(intentObj);
    call.resolve();
  }
}
