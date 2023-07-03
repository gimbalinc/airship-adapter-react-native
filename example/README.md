# RN Gimbal Airship Adapter Example

## Prerequisites
- If you haven't done so yet, read through the `README` in the adapter root folder for instructions on Airship and Gimbal project setup.
- Ensure your iOS and Android API keys are supplied in `App.tsx` in the relevant locations.
- Ensure that your Airship credentials are supplied in `airshipconfig.properties` for Android, `AirshipConfig.plist` for iOS.
- Ensure your dependencies are installed by running `yarn`. If there are any Cocoapods or other dependency-related errors, resolve these first.
- Ensure that the correct package name is present in `package.json` in the `android` script

## Running the App
### iOS
Open the `.xcworkspace` for the example app, and ensure that the bundle identifier for the app matches the bundle identifier that you registered your app with. You can examine your registered apps and their designated API keys through Gimbal Manager under `Applications`. Then, either run the app using the command `yarn ios`, or if you prefer to work through XCode, start a Metro instance first with the command `yarn start`, then run the app using XCode.

### Android
If you prefer to work through the command line, check in `package.json` under `scripts` that the appID supplied in the command `android` matches the appID that you registered your app with. You can examine your registered apps and their designated API keys through Gimbal Manager under `Applications`. Then, either run the app using the command `yarn android`, or if you prefer to work through Android Studio, first run `yarn android` to build the app, then proceed using Android Studio.