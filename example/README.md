# RN Gimbal Airship Adapter Example

## Prerequisites
- Ensure your iOS and Android API keys are supplied in `App.tsx` in the relevant locations.
- Ensure that your Airship credentials are supplied in `airshipconfig.properties` for Android, `AirshipConfig.plist` for iOS.
- Ensure your dependencies are installed by running `yarn`. If there are any Cocoapods or other dependency-related errors, resolve these first.
- Ensure that the correct package name is present in `package.json` in the `android` script

## Running the App
From terminal, run either `yarn ios` or `yarn android` depending on the desired platform.