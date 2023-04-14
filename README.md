# rtn-gimbal-airship-adapter

The Gimbal Airship Adapter is a React Native dependency that integrates Gimbal Place Event triggers
with Airship Custom Events for React Native apps.

## Resources
- [Gimbal Developer Guide](https://gimbal.com/doc/android/v4/devguide.html)
- [Gimbal Manager Portal](https://manager.gimbal.com)
- [Airship React Native SDK](https://github.com/urbanairship/react-native-airship)
- [Airship React Native Documentation](https://docs.airship.com/platform/mobile/setup/sdk/react-native/)
- [Airship General Documentation](https://docs.airship.com/platform/)
- [Airship and Gimbal Integration guide](https://docs.airship.com/partners/gimbal/)

## Installation

### Prerequisites

In [Gimbal Manager > Apps](https://manager.gimbal.com/apps) create an app for each iOS and Android.
(For the purposes of differentiating between them in analytics, it helps to make the names and bundle/package IDs unique.)
You can find your apps' API keys in the app detail view -- you will need these later.

Also ensure that you have an Airship project already set up, and note your app secret and keys.

This adapter is meant to work alongside an Airship dependency, which at the moment would be `@ua/react-native-airship`.
The adapter primarily manages the creation and propagation of Airship CustomEvents and RegionEvents, but does not initialize Airship on its own.

If push notifications are required, ensure that you've performed the necessary steps required for your platform. For iOS, make sure to change the app bundle ID to one registered with push capabilities. For Android, change the application ID to one registered with Firebase and add the necessary configuration file to the project.

### Add the plugin

```sh
npm install rtn-gimbal-airship-adapter
```

For iOS, after installing your dependencies you will also need to `pod install` from your `ios` directory.

## Initialization

First, ensure that your Airship credentials are present in both the `AirshipConfig.plist` and `airshipconfig.properties` for iOS and Android respectively.

You can import and start the adapter as shown:

```js
import { GimbalAirshipAdapter } from 'rtn-gimbal-airship-adapter';

GimbalAirshipAdapter.start(GIMBAL_API_KEY)
```

Where `GIMBAL_API_KEY` is your api key as obtained from Gimbal Manager. Please note that your iOS and Android apps are
managed separately in Gimbal Manager and so will have separate API keys.

Once the adapter is started, it will automatically resume its last state when the app is restarted, including if started in the background.
The API key and the started status are persisted between app starts -- you only need to call `start`  once.

Typically this will be called when the user has opted-in to a feature that benefits from location-triggered Airship notifications, after the appropriate permissions are granted by the user. It is also possible to call `start` before permissions are granted, but for Android, note that the first time that permissions are granted (*after* Gimbal is started), Gimbal may not request location updates from the OS until the next app restart.

## Permissions

This Adapter does not make requests on behalf of the app, as location permission flow has gotten far too complex -- it can't presume to know how or when any particular app should make its requests.
If granted, Gimbal will use fine, coarse and background location permissions, as well as Bluetooth scan permission, to be as location-aware as it can.

### iOS

```xml
<key>NSBluetoothAlwaysUsageDescription</key>
  <string>Let this sample app trigger Gimbal beacon-based events</string>
  <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
  <string>Let this sample app trigger Gimbal location-based events</string>
  <key>NSLocationAlwaysUsageDescription</key>
  <string>Let this sample app trigger Gimbal location-based events</string>
  <key>NSLocationWhenInUseUsageDescription</key>
  <string>Let this sample app trigger Gimbal location-based events while the app is in use</string>
  <key>UIBackgroundModes</key>
  <array>
    <string>location</string>
    <string>processing</string> <!-- required by Airship -->
    <string>remote-notification</string> <!-- required for notifications -->
  </array>
```

### Android

```xml
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
```

## Event Tracking
The adapter can be configured to track Airship Events when Gimbal Place Events are triggered. This tracking can be enabled or disabled as shown:

```js
  GimbalAirshipAdapter.setShouldTrackCustomEntryEvents(true);
  GimbalAirshipAdapter.setShouldTrackCustomExitEvents(true);
  GimbalAirshipAdapter.setShouldTrackRegionEvents(false);
```

By default, Airship CustomEvents are created upon Gimbal entry and exit events, while RegionEvents are disabled, as RegionEvents have been deprecated in favor of CustomEvents. Place entry events are tracked as `gimbal_custom_entry_event` and departure events are tracked as `gimbal_custom_exit_event`.

Each `CustomEvent` is populated with the following properties:

- `visitID` - a UUID for the Gimbal Visit. This is common for the visit's entry and departure.
- `placeIdentifier` - a UUID for the Gimbal Place
- `placeName` - the human readable place name as entered in Gimbal Manager. Not necessarily unique!
- `source` - always Gimbal
- `boundaryEvent` - an enumeration of `1` for entry and `2` for exit/departure

If there are any Place Attributes key-value pairs (as set on the triggering place in Gimbal Manager) present on the place that triggered the event, they will also be added to the `CustomEvent` properties.
They are prefixed with `GMBL_PA_`, e.g. `DMA:825` becomes `GMBL_PA_DMA:825`.

For more information regarding Airship Custom Events, see the Airship [Custom Event](https://docs.airship.com/guides/messaging/user-guide/data/custom-events/index.html) documentation.

## Stopping the adapter

```js
  GimbalAirshipAdapter.stop();
```
