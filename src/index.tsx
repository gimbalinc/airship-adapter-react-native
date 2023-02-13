import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'rtn-gimbal-airship-adapter' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

import type { Spec as GimbalAirshipAdapterSpec } from './NativeGimbalAirshipAdapter';

const GimbalAirshipAdapterModule = isTurboModuleEnabled
  ? require('./NativeGimbalAirshipAdapter').default
  : NativeModules.RtnGimbalAirshipAdapter;

export const GimbalAirshipAdapter: GimbalAirshipAdapterSpec =
  GimbalAirshipAdapterModule
    ? GimbalAirshipAdapterModule
    : new Proxy(
        {},
        {
          get() {
            throw new Error(LINKING_ERROR);
          },
        }
      );
