import React, { Component } from 'react';
import { Platform, View, Linking } from 'react-native';
import type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import { request, PERMISSIONS } from 'react-native-permissions';
import Airship from '@ua/react-native-airship';

import SingleButtonPage from '../../components/SingleButtonPage/SingleButtonPage';
import GlobalStyles from '../../global/GlobalStyles';

interface IntroContainerProps {
  onPageFinish: () => void;
}

interface IntroContainerState {
  currentIndex: Int32;
}

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
  }

  pageForIndex(index: Int32) {
    switch (index) {
      case 0: // Notification Permissions request page
        return (
          <SingleButtonPage
            pageText="Notification permission is necessary in order to receive Airship push events; if you need this functionality, please grant the permission once the prompt appears."
            buttonText="OK"
            buttonCallback={() => {
              Airship.push.enableUserNotifications().then((isEnabled) => {
                console.log(`Airship push enabled? ${isEnabled}`);
              });
              this.setState({ currentIndex: this.state.currentIndex + 1 });
            }}
          />
        );
      case 1: // Location Permission (WIU)
        return (
          <SingleButtonPage
            pageText="Location permission is necessary in order to detect place entry and departure; if you need this functionality, please grant the permission once the prompt appears."
            buttonText="OK"
            buttonCallback={() => {
              if (Platform.OS === 'ios') {
                request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
              } else if (Platform.OS === 'android') {
                request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
              }
              this.setState({ currentIndex: this.state.currentIndex + 1 });
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
              this.setState({ currentIndex: this.state.currentIndex + 1 });
            }}
          />
        );
      case 3: // Bluetooth Permission
        return (
          <SingleButtonPage
            pageText="Bluetooth permission is necessary to detect events for places defined using beacons: if you need this functionality, please grant the permission once the prompt appears.."
            buttonText="OK"
            buttonCallback={() => {
              if (Platform.OS === 'ios') {
                request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
              } else if (Platform.OS === 'android') {
                request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
              }
              this.setState({ currentIndex: this.state.currentIndex + 1 });
            }}
          />
        );
      default:
        this.props.onPageFinish();
        return;
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
