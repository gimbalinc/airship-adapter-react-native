package com.rtngimbalairshipadapter;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.gimbal.android.PrivacyManager;
import com.gimbal.android.Visit;
import com.gimbal.airship.AirshipAdapter;
import com.urbanairship.analytics.CustomEvent;
import com.urbanairship.analytics.location.RegionEvent;


public class RtnGimbalAirshipAdapterModule extends com.rtngimbalairshipadapter.RtnGimbalAirshipAdapterSpec {
  public static final String NAME = "RtnGimbalAirshipAdapter";

  RtnGimbalAirshipAdapterModule(ReactApplicationContext context) {
    super(context);
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

    AirshipAdapter.shared(getReactApplicationContext()).addListener(new AirshipAdapter.Listener() {
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
    promise.resolve(AirshipAdapter.shared(getReactApplicationContext()).isStarted());
  }


  @ReactMethod
  public void start(String apiKey) {
    if (apiKey != null) {
      AirshipAdapter.shared(getReactApplicationContext()).start(apiKey);
      AirshipAdapter.shared(getReactApplicationContext()).setShouldTrackCustomExitEvent(true);
      AirshipAdapter.shared(getReactApplicationContext()).setShouldTrackCustomEntryEvent(true);
    }
  }

  @ReactMethod
  public void stop() {
    AirshipAdapter.shared(getReactApplicationContext()).stop();
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
}
