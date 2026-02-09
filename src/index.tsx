import { EmitterSubscription, NativeModules } from 'react-native';
import EventEmitter from './EventEmitter';

import type { Spec as NativeModuleSpec } from './NativeGimbalAirshipAdapterModule';

let cachedNativeModule: NativeModuleSpec | null = null;

/**
 * Resolve the native module lazily so that in bridgeless/New Architecture
 * we use the TurboModule after __turboModuleProxy has been set by the runtime.
 */
function getNativeModule(): NativeModuleSpec {
  if (cachedNativeModule != null) {
    return cachedNativeModule;
  }
  // @ts-expect-error
  if (global.__turboModuleProxy != null) {
    const mod = require('./NativeGimbalAirshipAdapterModule').default;
    if (mod != null) {
      cachedNativeModule = mod;
      return cachedNativeModule!;
    }
  }
  const legacy = NativeModules.RtnGimbalAirshipAdapter;
  if (legacy != null) {
    cachedNativeModule = legacy;
    return cachedNativeModule!;
  }
  throw new Error(
    'RtnGimbalAirshipAdapter native module is not available. ' +
      'Ensure the app has fully initialized (e.g. call adapter methods after componentDidMount) and that the native module is linked.'
  );
}

export enum RegionEventType {
  /**
   * Region enter.
   */
  Enter = 'regionEnter',

  /**
   * Region exit.
   */
  Exit = 'regionExit',
}

/**
 * Gimbal consent types.
 */
export enum ConsentType {
  /**
   * Indicates a choice for consent to Place Monitoring functionality
   */
  Places = 'places',
}

/**
 * Gimbal consent state.
 */
export enum ConsentState {
  /**
   * Unknown. Typically because the user has not yet been asked for consent.
   */
  Unknown = 'unknown',

  /**
   * Consent has been granted by the user.
   */
  Granted = 'granted',

  /**
   * Consent has been refused by the user
   */
  Refused = 'refused',
}

/**
 * GDPR consent requirement.
 */
export enum ConsentRequirement {
  /**
   * GDPR user consent status is not yet known - The Gimbal SDK has not yet been able to contact its server
   */
  Unknown = 'unknown',

  /**
   * GDPR user consent is required at this location
   */
  NotRequired = 'notRequired',

  /**
   * GDPR user consent is not required at this location - it may be required at a different location
   */
  Required = 'required',
}

/**
 * A Gimbal place.
 */
export interface Place {
  /**
   * The place's ID.
   */
  identifier: string;

  /**
   * The place's name.
   */
  name: string;

  /**
   * The place's attributes.
   */
  attribute: object;
}

/**
 * An event fired when a region is entered or exited.
 */
export interface RegionEvent {
  /**
   * The visit ID.
   */
  identifier: string;

  /**
   * Dwell time in seconds.
   */
  dwellTime: number;

  /**
   * The arrival time as an ISO 8601 timestamp.
   */
  arrivalTime: string;

  /**
   * The departure time aas an ISO 8601 timestamp.
   */
  departureTime?: string;

  /**
   * The place.
   */
  place: Place;
}

/**
 * @hidden
 */
function convertEventEnum(eventType: RegionEventType): string {
  if (eventType === RegionEventType.Enter) {
    return 'com.urbanairship.gimbal.region_enter';
  } else if (eventType === RegionEventType.Exit) {
    return 'com.urbanairship.gimbal.region_exit';
  }
  throw new Error('Invalid event type: ' + eventType);
}

const eventEmitter = new EventEmitter();

import type { Spec as GimbalAirshipAdapterSpec } from './GimbalAirshipAdapter';

/**
 * Airship Gimbal Adapter.
 */
export const GimbalAirshipAdapter: GimbalAirshipAdapterSpec = {
  /**
   * Saves your Gimbal API key without explicitly starting the adapter. If you want to call adapter
   * methods on Androids while the adapter is off, you must first pass in your API key using this
   * method.
   * @param apiKey The Gimbal API key
   */
  setApiKey(apiKey: string): void {
    return getNativeModule().setApiKey(apiKey);
  },

  /**
   * Starts the adapter.
   * @param apiKey The Gimbal API key.
   * @return A promise with a boolean result indicating whether the adapter has successfully started
   * or not.
   */
  start(apiKey: string): Promise<boolean> {
    return getNativeModule().start(apiKey);
  },

  /**
   * Stops the Gimbal Adapter.
   */
  stop() {
    getNativeModule().stop();
  },

  /**
   * Checks if the adapter is started.
   * @return A promise with the result.
   */
  isStarted(): Promise<boolean> {
    return getNativeModule().isStarted();
  },

  /**
   * Checks if GDPR consent is required to use Gimbal.
   * @return A promise with the result.
   */
  getGdprConsentRequirement(): Promise<ConsentRequirement> {
    return getNativeModule().getGdprConsentRequirement() as Promise<ConsentRequirement>;
  },

  /**
   * Sets the GDPR consent result for the consent type.
   * @param consentType The consent type.
   * @param consentState The consent state.
   */
  setUserConsent(consentType: ConsentType, consentState: ConsentState) {
    getNativeModule().setUserConsent(consentType, consentState);
  },

  /**
   * Gets the GDPR consent for the consent type.
   * @param consentType The consent type.
   * @return A promise with the result.
   */
  getUserConsent(consentType: ConsentType): Promise<ConsentState> {
    return getNativeModule().getUserConsent(
      consentType
    ) as Promise<ConsentState>;
  },

  /**
   * Enables / disables the creation of an Airship CustomEvent upon place entry.Tracking is enabled
   * by default.
   */
  setShouldTrackCustomEntryEvents(shouldTrack: boolean): void {
    getNativeModule().setShouldTrackCustomEntryEvents(shouldTrack);
  },

  /**
   * Enables / disables the creation of an Airship CustomEvent upon place exit. Tracking is enabled
   * by default.
   */
  setShouldTrackCustomExitEvents(shouldTrack: boolean): void {
    getNativeModule().setShouldTrackCustomExitEvents(shouldTrack);
  },

  /**
   * Enables / disables the creation of an Airship RegionEvent upon place entry and exit. Tracking
   * is disabled by default, since RegionEvents are deprecated in favor of CustomEvents.
   */
  setShouldTrackRegionEvents(shouldTrack: boolean): void {
    getNativeModule().setShouldTrackRegionEvents(shouldTrack);
  },

  /**
   * Associates a User Analytics Identifier with an application instance.  This may be used to enrich exported analytics events from Gimbal Manager.
   *
   * @param id - the User Analytics Identifier
   */
  setAnalyticsId(id: string): void {
    getNativeModule().setAnalyticsId(id);
  },

  /**
   * Adds a listener for an Airship Gimbal event.
   *
   * @param eventType The event type. Either regionEnter or regionExit.
   * @param listener The event listener.
   * @return An emitter subscription.
   */
  addListener(
    eventType: RegionEventType,
    listener: (event: RegionEvent) => void
  ): EmitterSubscription {
    var name = convertEventEnum(eventType);
    return eventEmitter.addListener(name, listener);
  },

  /**
   * Removes a listener for an Airship Gimbal event.
   *
   * @param eventType The event type. Either regionEnter or regionExit.
   * @param listener The event listener.
   */
  removeListeners(eventType: RegionEventType) {
    var name = convertEventEnum(eventType);
    eventEmitter.removeAllListeners(name);
  },
};
