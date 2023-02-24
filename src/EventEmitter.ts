import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
  Platform,
} from 'react-native';

/**
 * @hidden
 */
const { RtnGimbalAirshipAdapter } = NativeModules;

/**
 * @hidden
 */
export default class EventEmitter extends NativeEventEmitter {
  constructor() {
    super(RtnGimbalAirshipAdapter);
  }

  addListener(
    eventType: string,
    listener: (event: any) => void,
    context?: Object
  ): EmitterSubscription {
    if (Platform.OS === 'android') {
      RtnGimbalAirshipAdapter.addAndroidListener(eventType);
    }
    // @ts-ignore
    return super.addListener(eventType, listener, context);
  }

  removeAllListeners(eventType: string) {
    if (Platform.OS === 'android') {
      // @ts-ignore
      const count = this.listeners(eventType).length;
      RtnGimbalAirshipAdapter.removeAndroidListeners(count);
    }

    super.removeAllListeners(eventType);
  }

  removeSubscription(subscription: EmitterSubscription) {
    if (Platform.OS === 'android') {
      RtnGimbalAirshipAdapter.removeAndroidListeners(1);
    }
    super.removeSubscription(subscription);
  }
}
