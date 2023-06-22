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

const GIMBAL_API_KEY_IOS = 'YOUR_GIMBAL_IOS_API_KEY';
const GIMBAL_API_KEY_DROID = 'YOUR_GIMBAL_ANDROID_API_KEY';
const KEY_DID_SHOW_INTRO = 'didShowIntroKey';

interface AppProps {}

interface AppState {
  channelId: string | null | undefined;
  isStarted: boolean;
  gdprConsentRequirement: ConsentRequirement | null;
  shouldShowIntro: boolean;
}

export default class AirshipSample extends Component<AppProps, AppState> {
  constructor(props: any) {
    super(props);

    this.state = {
      channelId: '',
      isStarted: false,
      gdprConsentRequirement: null,
      shouldShowIntro: false,
    };

    this.apiKey = this.apiKey.bind(this);
    this.introContainerComponent = this.introContainerComponent.bind(this);
    this.bodyContainerComponent = this.bodyContainerComponent.bind(this);
  }

  componentDidMount() {
    GimbalAirshipAdapter.setApiKey(this.apiKey());

    AsyncStorage.getItem(KEY_DID_SHOW_INTRO).then((didShowIntro) => {
      if (!didShowIntro) {
        AsyncStorage.setItem(KEY_DID_SHOW_INTRO, 'true');
        this.setState({ shouldShowIntro: true });
      }
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
        onPageFinish={() => this.setState({ shouldShowIntro: false })}
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

  render() {
    return (
      <View style={GlobalStyles.backgroundContainer}>
        {this.state.shouldShowIntro
          ? this.introContainerComponent()
          : this.bodyContainerComponent()}
      </View>
    );
  }
}
