import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  addListener(eventName: string): void;
  removeListeners(count: number): void;
  addAndroidListener(eventName: string): void;
  removeAndroidListeners(count: number): void;
  setApiKey(gimbalApiKey: string): void;
  start(gimbalApiKey: string): Promise<boolean>;
  stop(): void;
  isStarted(): Promise<boolean>;
  getGdprConsentRequirement(): Promise<string>;
  setUserConsent(consentType: string, state: string): void;
  getUserConsent(consentType: string): Promise<string>;
  setShouldTrackCustomEntryEvents(shouldTrack: boolean): void;
  setShouldTrackCustomExitEvents(shouldTrack: boolean): void;
  setShouldTrackRegionEvents(shouldTrack: boolean): void;
  setAnalyticsId(id: string): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'RtnGimbalAirshipAdapter'
);
