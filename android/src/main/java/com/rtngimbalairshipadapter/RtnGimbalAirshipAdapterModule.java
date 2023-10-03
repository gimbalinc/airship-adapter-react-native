package com.rtngimbalairshipadapter;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.gimbal.airship.AirshipAdapter;
import com.gimbal.android.AnalyticsManager;
import com.gimbal.android.Gimbal;
import com.gimbal.android.PrivacyManager;
import com.gimbal.android.Visit;
import com.urbanairship.analytics.CustomEvent;
import com.urbanairship.analytics.location.RegionEvent;


public class RtnGimbalAirshipAdapterModule extends RtnGimbalAirshipAdapterSpec {
  public static final String NAME = "RtnGimbalAirshipAdapter";

  private static final String PREFERENCE_FILE_KEY =
    "com.gimbal.rtn.react.native.airship.adapter.android.preference.key";
  private static final String PREFERENCE_KEY_DID_SET_CUSTOM_ENTRY_PREFERENCE =
    "com.gimbal.rtn.react.native.airship.adapter.didset.customentry.preference";
  private static final String PREFERENCE_KEY_DID_SET_CUSTOM_EXIT_PREFERENCE =
    "com.gimbal.rtn.react.native.airship.adapter.didset.customexit.preference";
  private static final String PREFERENCE_KEY_DID_SET_REGION_EVENT_PREFERENCE =
    "com.gimbal.rtn.react.native.airship.adapter.didset.regionevent.preference";

  private final SharedPreferences preferences;

  RtnGimbalAirshipAdapterModule(ReactApplicationContext context) {
    super(context);
    preferences = context.getSharedPreferences(PREFERENCE_FILE_KEY, Context.MODE_PRIVATE);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @Override
  public void initialize() {
    super.initialize();

    EventEmitter.shared().attachReactContext(getReactApplicationContext());

    airshipAdapter().addListener(new AirshipAdapter.Listener() {
      @Override
      public void onRegionEntered(@NonNull RegionEvent regionEvent, @NonNull Visit visit) {
        EventEmitter.shared().sendEvent(VisitEvent.enterEvent(visit));
      }

      @Override
      public void onRegionExited(@NonNull RegionEvent regionEvent, @NonNull Visit visit) {
        EventEmitter.shared().sendEvent(VisitEvent.exitEvent(visit));
      }

      @Override
      public void onCustomRegionEntry(@NonNull CustomEvent event, @NonNull Visit visit) {
        EventEmitter.shared().sendEvent(VisitEvent.enterEvent(visit));
      }

      @Override
      public void onCustomRegionExit(@NonNull CustomEvent event, @NonNull Visit visit) {
        EventEmitter.shared().sendEvent(VisitEvent.exitEvent(visit));
      }
    });

    if (!didSetCustomEntryTrackingPreference()) {
      airshipAdapter().setShouldTrackCustomEntryEvent(true);
    }

    if (!didSetCustomExitTrackingPreference()) {
      airshipAdapter().setShouldTrackCustomExitEvent(true);
    }

    if (!didSetRegionEventTrackingPreference()) {
      airshipAdapter().setShouldTrackRegionEvent(false);
    }
  }

  /**
   * Called when a new listener is added for a specified event name.
   *
   * @param eventName The event name.
   */
  @ReactMethod
  public void addAndroidListener(String eventName) {
    EventEmitter.shared().addAndroidListener(eventName);
  }

  /**
   * Called when listeners are removed.
   *
   * @param count The count of listeners.
   */
  @ReactMethod
  public void removeAndroidListeners(int count) {
    EventEmitter.shared().removeAndroidListeners(count);
  }

  @ReactMethod
  public void addListener(String eventName) {
    // Keep: Required for RN built in Event Emitter Calls.
  }

  @ReactMethod
  public void removeListeners(Integer count) {
    // Keep: Required for RN built in Event Emitter Calls.
  }

  @ReactMethod
  public void isStarted(Promise promise) {
    promise.resolve(airshipAdapter().isStarted());
  }

  @ReactMethod
  public void setApiKey(String apiKey) {
    Gimbal.setApiKey((Application) getReactApplicationContext().getApplicationContext(), apiKey);
  }

  @ReactMethod
  public void start(String apiKey, Promise promise) {
    if (apiKey != null) {
      airshipAdapter().start(apiKey);
    }

    promise.resolve(airshipAdapter().isStarted());
  }

  @ReactMethod
  public void stop() {
    airshipAdapter().stop();
  }

  @ReactMethod
  public void getGdprConsentRequirement(Promise promise) {
    String result = convertConsentRequirement(PrivacyManager.getInstance().getGdprConsentRequirement());
    promise.resolve(result);
  }

  @ReactMethod
  public void setUserConsent(String type, String state) {
    PrivacyManager.getInstance().setUserConsent(convertConsentType(type), convertConsentState(state));
  }

  @ReactMethod
  public void getUserConsent(String type, Promise promise) {
    String result = convertConsentState(PrivacyManager.getInstance().getUserConsent(convertConsentType(type)));
    promise.resolve(result);
  }

  @ReactMethod
  public void setShouldTrackCustomEntryEvents(boolean shouldTrack) {
    editBooleanPreference(PREFERENCE_KEY_DID_SET_CUSTOM_ENTRY_PREFERENCE, true);
    airshipAdapter().setShouldTrackCustomEntryEvent(shouldTrack);
  }

  @ReactMethod
  public void setShouldTrackCustomExitEvents(boolean shouldTrack) {
    editBooleanPreference(PREFERENCE_KEY_DID_SET_CUSTOM_EXIT_PREFERENCE, true);
    airshipAdapter().setShouldTrackCustomExitEvent(shouldTrack);
  }

  @ReactMethod
  public void setShouldTrackRegionEvents(boolean shouldTrack) {
    editBooleanPreference(PREFERENCE_KEY_DID_SET_REGION_EVENT_PREFERENCE, true);
    airshipAdapter().setShouldTrackRegionEvent(shouldTrack);
  }

  @ReactMethod
  public void setAnalyticsId(String id) {
    AnalyticsManager.getInstance().setUserAnalyticsID(id);
  }

  @NonNull
  private PrivacyManager.ConsentType convertConsentType(@NonNull String consentType) {
    switch (consentType) {
      case "places":
        return PrivacyManager.ConsentType.PLACES_CONSENT;
      default:
        throw new IllegalArgumentException("Unexpected consent type: " + consentType);
    }
  }

  @NonNull
  private PrivacyManager.ConsentState convertConsentState(@NonNull String consentState) {
    switch (consentState) {
      case "refused":
        return PrivacyManager.ConsentState.CONSENT_REFUSED;
      case "granted":
        return PrivacyManager.ConsentState.CONSENT_GRANTED;
      case "unknown":
        return PrivacyManager.ConsentState.CONSENT_UNKNOWN;
      default:
        throw new IllegalArgumentException("Unexpected consent state: " + consentState);
    }
  }

  private boolean didSetCustomEntryTrackingPreference() {
    return preferences.getBoolean(PREFERENCE_KEY_DID_SET_CUSTOM_ENTRY_PREFERENCE, false);
  }

  private boolean didSetCustomExitTrackingPreference() {
    return preferences.getBoolean(PREFERENCE_KEY_DID_SET_CUSTOM_EXIT_PREFERENCE, false);
  }

  private boolean didSetRegionEventTrackingPreference() {
    return preferences.getBoolean(PREFERENCE_KEY_DID_SET_REGION_EVENT_PREFERENCE, false);
  }

  @NonNull
  private String convertConsentState(@NonNull PrivacyManager.ConsentState consentState) {
    switch (consentState) {
      case CONSENT_REFUSED:
        return "refused";
      case CONSENT_GRANTED:
        return "granted";
      case CONSENT_UNKNOWN:
        return "unknown";
      default:
        throw new IllegalArgumentException("Unexpected consent state: " + consentState);
    }
  }

  @NonNull
  private String convertConsentRequirement(@NonNull PrivacyManager.GdprConsentRequirement consentRequirement) {
    switch (consentRequirement) {
      case REQUIRED:
        return "required";
      case NOT_REQUIRED:
        return "notRequired";
      case REQUIREMENT_UNKNOWN:
        return "unknown";
      default:
        throw new IllegalArgumentException("Unexpected consent requirement: " + consentRequirement);
    }
  }

  @NonNull
  private AirshipAdapter airshipAdapter() {
    return AirshipAdapter.shared(getReactApplicationContext());
  }

  private void editBooleanPreference(String preferenceKey, boolean value) {
    SharedPreferences.Editor editor = preferences.edit();
    editor.putBoolean(preferenceKey, value);
    editor.apply();
  }
}
