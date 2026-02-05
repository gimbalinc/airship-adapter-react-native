package com.rtngimbalairshipadapter;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.BaseReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import java.util.HashMap;
import java.util.Map;


public class RtnGimbalAirshipAdapterPackage extends BaseReactPackage {

  @Nullable
  @Override
  public NativeModule getModule(String name, ReactApplicationContext reactContext) {
    if (name.equals(RtnGimbalAirshipAdapterModule.NAME)) {
      return new RtnGimbalAirshipAdapterModule(reactContext);
    } else {
      return null;
    }
  }

  @NonNull
  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return () -> {
      final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
      moduleInfos.put(
              RtnGimbalAirshipAdapterModule.NAME,
              new ReactModuleInfo(
                      RtnGimbalAirshipAdapterModule.NAME,
                      RtnGimbalAirshipAdapterModule.NAME,
                      false, // canOverrideExistingModule
                      true, // needsEagerInit
                      false, // hasConstants
                      false, // isCxxModule
                      true // isTurboModule
      ));
      return moduleInfos;
    };
  }
}
