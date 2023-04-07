import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  addListener(eventName: string): void;
  removeListeners(count: Int32): void;
  setGimbalApiKey(gimbalApiKey: string): void;
  start(gimbalApiKey: string): Promise<boolean>;
  stop(): void;
  isStarted(): Promise<boolean>;
  getGdprConsentRequirement(): Promise<Int32>;
  setUserConsent(consentType: Int32, state: Int32): void;
  getUserConsent(consentType: Int32): Promise<Int32>;
  setShouldTrackCustomEntryEvents(shouldTrack: boolean): void;
  setShouldTrackCustomExitEvents(shouldTrack: boolean): void;
  setShouldTrackRegionEvents(shouldTrack: boolean): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'RtnGimbalAirshipAdapter'
);
