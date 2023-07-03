import React, { Component } from 'react';
import { Platform, View, Linking } from 'react-native';
import type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import {
  request,
  PERMISSIONS,
  PermissionStatus,
} from 'react-native-permissions';
import Airship from '@ua/react-native-airship';

import SingleButtonPage from '../../components/SingleButtonPage/SingleButtonPage';
import GlobalStyles from '../../global/GlobalStyles';

interface IntroContainerProps {
  onPageFinish: () => void;
}

interface IntroContainerState {
  currentIndex: Int32;
}

const PAGE_MAX_INDEX = 3;

export default class IntroContainer extends Component<
  IntroContainerProps,
  IntroContainerState
> {
  constructor(props: IntroContainerProps) {
    super(props);

    this.state = {
      currentIndex: 0,
    };

    this.pageForIndex = this.pageForIndex.bind(this);
    this.onClick = this.onClick.bind(this);
    this.requestLocationPermissions =
      this.requestLocationPermissions.bind(this);
    this.requestBluetoothPermissions =
      this.requestBluetoothPermissions.bind(this);
  }

  onClick() {
    if (this.state.currentIndex === PAGE_MAX_INDEX) {
      this.props.onPageFinish();
    } else {
      this.setState({ currentIndex: this.state.currentIndex + 1 });
    }
  }

  pageForIndex(index: Int32) {
    switch (index) {
      case 0: // Notification Permissions request page
        return (
          <SingleButtonPage
            pageText="Notification permission is necessary in order to receive Airship push events; if you need this functionality, please grant the permission once the prompt appears."
            buttonText="OK"
            buttonCallback={() => {
              Airship.push
                .enableUserNotifications()
                .then((result) => {
                  console.log(
                    `Requested notification permissions, result: ${result}`
                  );
                })
                .catch((error) => {
                  console.log(
                    `Error while enabling notification permissions: ${error}`
                  );
                });
              this.onClick();
            }}
          />
        );
      case 1: // Location Permission (WIU)
        return (
          <SingleButtonPage
            pageText="Location permission is necessary in order to detect place entry and departure; if you need this functionality, please grant the permission once the prompt appears."
            buttonText="OK"
            buttonCallback={() => {
              this.requestLocationPermissions(Platform.OS)
                .then((permissonStatus) => {
                  console.log(
                    `Requested Location permissions, result: ${permissonStatus}`
                  );
                })
                .catch((error) => {
                  console.log(
                    `Error requesting Location permissions: ${error}`
                  );
                });
              this.onClick();
            }}
          />
        );
      case 2: // Location Permission (Always)
        return (
          <SingleButtonPage
            pageText="Location 'always' permission is necessary to detect place events from the background: if you need this functionality, please grant 'location always' permission from your device Settings page."
            buttonText="Open 'Settings'"
            buttonCallback={() => {
              Linking.openSettings();
              this.onClick();
            }}
          />
        );
      case 3: // Bluetooth Permission
        return (
          <SingleButtonPage
            pageText="Bluetooth permission is necessary to detect events for places defined using beacons: if you need this functionality, please grant the permission once the prompt appears."
            buttonText="OK"
            buttonCallback={() => {
              this.requestBluetoothPermissions(Platform.OS)
                .then((permissonStatus) => {
                  console.log(
                    `Requested bluetooth permissions, result: ${permissonStatus}`
                  );
                })
                .catch((error) => {
                  console.log(
                    `Error requesting bluetooth permissions: ${error}`
                  );
                });
              this.onClick();
            }}
          />
        );
      default:
        this.props.onPageFinish();
        return;
    }
  }

  requestLocationPermissions(platform: string): Promise<PermissionStatus> {
    if (platform === 'ios') {
      return request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      return request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }
  }

  requestBluetoothPermissions(platform: string): Promise<PermissionStatus> {
    if (platform === 'ios') {
      return request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
    } else {
      return request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
    }
  }

  render() {
    return (
      <View style={GlobalStyles.cellContainer}>
        {this.pageForIndex(this.state.currentIndex)}
      </View>
    );
  }
}
