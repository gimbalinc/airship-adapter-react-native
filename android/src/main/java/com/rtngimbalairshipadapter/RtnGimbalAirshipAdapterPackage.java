package com.rtngimbalairshipadapter;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.TurboReactPackage;

import java.util.HashMap;
import java.util.Map;

public class RtnGimbalAirshipAdapterPackage extends TurboReactPackage {

  @Nullable
  @Override
  public NativeModule getModule(String name, ReactApplicationContext reactContext) {
    if (name.equals(RtnGimbalAirshipAdapterModule.NAME)) {
      return new RtnGimbalAirshipAdapterModule(reactContext);
    } else {
      return null;
    }
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return () -> {
      final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
      boolean isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
      moduleInfos.put(
              RtnGimbalAirshipAdapterModule.NAME,
              new ReactModuleInfo(
                      RtnGimbalAirshipAdapterModule.NAME,
                      RtnGimbalAirshipAdapterModule.NAME,
                      false, // canOverrideExistingModule
                      true, // needsEagerInit
                      false, // hasConstants
                      false, // isCxxModule
                      isTurboModule // isTurboModule
      ));
      return moduleInfos;
    };
  }
}
