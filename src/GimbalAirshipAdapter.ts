import type {
  ConsentRequirement,
  ConsentState,
  ConsentType,
  RegionEvent,
  RegionEventType,
} from 'rtn-gimbal-airship-adapter';

import type { EmitterSubscription } from 'react-native';

export interface Spec {
  /**
   * Starts the adapter.
   * @param apiKey The Gimbal API key.
   * @return A promise with a boolean result indicating whether the adapter successfully started.
   */
  start(apiKey: string): Promise<boolean>;

  /**
   * Stops the Gimbal Adapter.
   */
  stop(): void;

  /**
   * Checks if the adapter is started.
   * @return A promise with the result.
   */
  isStarted(): Promise<boolean>;

  /**
   * Checks if GDPR consent is required to use Gimbal.
   * @return A promise with the result.
   */
  getGdprConsentRequirement(): Promise<ConsentRequirement>;

  /**
   * Sets the GDPR consent result for the consent type.
   * @param consentType The consent type.
   * @param consentState The consent state.
   */
  setUserConsent(consentType: ConsentType, consentState: ConsentState): void;

  /**
   * Gets the GDPR consent for the consent type.
   * @param consentType The consent type.
   * @return A promise with the result.
   */
  getUserConsent(consentType: ConsentType): Promise<ConsentState>;

  /**
   * Enables/disables creation and tracking of Airship CustomEvents upon location entry. This
   * behavior is enabled by default.
   * @param shouldTrack Whether or not a CustomEvent should be created when the user enters a location
   */
  setShouldTrackCustomEntryEvents(shouldTrack: boolean): void;

  /**
   * Enables/disables creation and tracking of Airship CustomEvents upon location exit. This
   * behavior is enabled by default.
   * @param shouldTrack Whether or not a CustomEvent should be created when the user exits a location
   */
  setShouldTrackCustomExitEvents(shouldTrack: boolean): void;

  /**
   * Enables/disables creation and tracking of Airship RegionEvents upon location entry. This
   * behavior is disabled by default because RegionEvents have been deprecated in favor of
   * CustomEvents.
   * @param shouldTrack Whether or not a CustomEvent should be created when the user enters a location
   */
  setShouldTrackRegionEvents(shouldTrack: boolean): void;

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
  ): EmitterSubscription;

  /**
   * Removes a listener for an Airship Gimbal event.
   *
   * @param eventType The event type. Either regionEnter or regionExit.
   * @param listener The event listener.
   */
  removeListeners(eventType: RegionEventType): void;
}
