package com.rtngimbalairshipadapter;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = RtnGimbalAirshipAdapterModule.NAME, hasConstants = false)
abstract class RtnGimbalAirshipAdapterSpec extends ReactContextBaseJavaModule {
  RtnGimbalAirshipAdapterSpec(ReactApplicationContext context) {
    super(context);
  }
  public abstract void addAndroidListener(String eventName);

  public abstract void removeAndroidListeners(int count);

  public abstract void addListener(String eventName);

  public abstract void removeListeners(Integer count);

  public abstract void isStarted(Promise promise);

  public abstract void setApiKey(String apiKey);

  public abstract void start(String apiKey, Promise promise);

  public abstract void stop();

  public abstract void getGdprConsentRequirement(Promise promise);

  public abstract void setUserConsent(String type, String state);

  public abstract void getUserConsent(String type, Promise promise);

  public abstract void setShouldTrackCustomEntryEvents(boolean shouldTrack);

  public abstract void setShouldTrackCustomExitEvents(boolean shouldTrack);

  public abstract void setShouldTrackRegionEvents(boolean shouldTrack);

  public abstract void setAnalyticsId(String id);
}
