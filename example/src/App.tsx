/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * @flow
 */
'use strict';

import {
  GimbalAirshipAdapter,
  ConsentRequirement,
} from 'rtn-gimbal-airship-adapter';
import React, { Component } from 'react';
import { Platform, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GlobalStyles from './global/GlobalStyles';

import EnableAdapterToggle from './features/EnableAdapterToggle/EnableAdapterToggle';
import SetConsentToggle from './features/SetConsentToggle/SetConsentToggle';
import EventTranscriptContainer from './features/EventTranscript/EventTranscriptContainer';
import IntroContainer from './features/Intro/IntroContainer';
import Airship from '@ua/react-native-airship';

const GIMBAL_API_KEY_IOS = 'YOUR_GIMBAL_IOS_API_KEY';
const GIMBAL_API_KEY_DROID = 'YOUR_GIMBAL_ANDROID_API_KEY';
const KEY_DID_SHOW_INTRO = 'didShowIntroKey';

const SHOULD_SHOW_INTRO_VALUES = {
  unknown: 0,
  true: 1,
  false: 2,
};

interface AppProps {}

interface AppState {
  channelId: string | null | undefined;
  isStarted: boolean;
  gdprConsentRequirement: ConsentRequirement | null;
  shouldShowIntro: number;
}

export default class AirshipSample extends Component<AppProps, AppState> {
  constructor(props: any) {
    super(props);

    this.state = {
      channelId: '',
      isStarted: false,
      gdprConsentRequirement: null,
      shouldShowIntro: SHOULD_SHOW_INTRO_VALUES.unknown,
    };

    this.apiKey = this.apiKey.bind(this);
    this.introContainerComponent = this.introContainerComponent.bind(this);
    this.bodyContainerComponent = this.bodyContainerComponent.bind(this);
    this.currentView = this.currentView.bind(this);
  }

  componentDidMount() {
    GimbalAirshipAdapter.setApiKey(this.apiKey());
    GimbalAirshipAdapter.setAnalyticsId('your_analytics_id');

    AsyncStorage.getItem(KEY_DID_SHOW_INTRO).then((didShowIntro) => {
      if (!didShowIntro) {
        AsyncStorage.setItem(KEY_DID_SHOW_INTRO, 'true');
        this.setState({ shouldShowIntro: SHOULD_SHOW_INTRO_VALUES.true });
      } else {
        this.setState({ shouldShowIntro: SHOULD_SHOW_INTRO_VALUES.false });
      }
    });

    Airship.channel
      .getChannelId()
      .then((channelId) => {
        console.log(`channel ID: ${channelId}`);
      })
      .catch((error) => {
        console.error('Failed to get Airship channel ID:', error);
      });

    // by default, custom entry and custom exit events are enabled, and region events are disabled
    // GimbalAirshipAdapter.setShouldTrackCustomEntryEvents(true);
    // GimbalAirshipAdapter.setShouldTrackCustomExitEvents(true);
    // GimbalAirshipAdapter.setShouldTrackRegionEvents(false);
  }

  apiKey() {
    console.log(`using provided apiKey for platform ${Platform.OS}`);
    if (Platform.OS === 'ios') {
      return GIMBAL_API_KEY_IOS;
    } else {
      return GIMBAL_API_KEY_DROID;
    }
  }

  introContainerComponent() {
    return (
      <IntroContainer
        onPageFinish={() =>
          this.setState({ shouldShowIntro: SHOULD_SHOW_INTRO_VALUES.false })
        }
      />
    );
  }

  bodyContainerComponent() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 30 }} />
        <Text style={GlobalStyles.header}>Gimbal Airship Adapter</Text>
        <View style={{ height: 30 }} />
        <Text style={GlobalStyles.text}>Gimbal API Key: {this.apiKey()}</Text>
        <EnableAdapterToggle apiKey={this.apiKey()} />
        <SetConsentToggle />
        <EventTranscriptContainer />
      </View>
    );
  }

  currentView() {
    if (this.state.shouldShowIntro === SHOULD_SHOW_INTRO_VALUES.unknown) {
      return (
        <View style={{ flex: 1 }}>
          <Text style={GlobalStyles.header}>Loading...</Text>
        </View>
      );
    } else if (this.state.shouldShowIntro === SHOULD_SHOW_INTRO_VALUES.true) {
      return this.introContainerComponent();
    } else {
      return this.bodyContainerComponent();
    }
  }

  render() {
    return (
      <View style={GlobalStyles.backgroundContainer}>{this.currentView()}</View>
    );
  }
}
