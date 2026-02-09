package com.rtngimbalairshipadapter;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.turbomodule.core.interfaces.TurboModule;

public abstract class RtnGimbalAirshipAdapterSpec extends ReactContextBaseJavaModule implements TurboModule {
  
  public static final String NAME = "RtnGimbalAirshipAdapter";

  public RtnGimbalAirshipAdapterSpec(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public String getName() {
    return NAME;
  }

  public abstract void addListener(String eventName);
  public abstract void removeListeners(double count);
  public abstract void addAndroidListener(String eventName);
  public abstract void removeAndroidListeners(double count);
  public abstract void setApiKey(String gimbalApiKey);
  public abstract void start(String gimbalApiKey, Promise promise);
  public abstract void stop();
  public abstract void isStarted(Promise promise);
  public abstract void getGdprConsentRequirement(Promise promise);
  public abstract void setUserConsent(String consentType, String state);
  public abstract void getUserConsent(String consentType, Promise promise);
  public abstract void setShouldTrackCustomEntryEvents(boolean shouldTrack);
  public abstract void setShouldTrackCustomExitEvents(boolean shouldTrack);
  public abstract void setShouldTrackRegionEvents(boolean shouldTrack);
  public abstract void setAnalyticsId(String id);
}
