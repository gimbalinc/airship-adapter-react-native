/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * @flow
 */
'use strict';

import {
  GimbalAirshipAdapter,
  ConsentType,
  ConsentState,
  RegionEventType,
  ConsentRequirement,
} from 'rtn-gimbal-airship-adapter';

import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  Switch,
  ScrollView,
} from 'react-native';

import Airship, { EventType } from '@ua/react-native-airship';

const GIMBAL_API_KEY = 'YOUR_API_KEY';

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#E0A500',
  },
  contentContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#E0A500',
  },
  cellContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0A500',
    marginTop: 15,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#0d6a83',
    textAlign: 'center',
    padding: 10,
  },
  rowLabel: {
    flexDirection: 'row',
    color: '#0d6a83',
    fontSize: 16,
    marginRight: 10,
  },
});

interface AppProps {}

interface AppState {
  channelId: string | null | undefined;
  isStarted: boolean;
  placesConsent: ConsentState | null;
  gdprConsentRequirement: ConsentRequirement | null;
}

export default class AirshipSample extends Component<AppProps, AppState> {
  constructor(props: any) {
    super(props);

    GimbalAirshipAdapter.setApiKey(GIMBAL_API_KEY);

    this.state = {
      channelId: '',
      isStarted: false,
      placesConsent: null,
      gdprConsentRequirement: null,
    };

    this.handleStartAdapter = this.handleStartAdapter.bind(this);
    this.handlePlacesConsent = this.handlePlacesConsent.bind(this);
  }

  handleStartAdapter(enabled: boolean) {
    if (enabled) {
      GimbalAirshipAdapter.start(GIMBAL_API_KEY).then((isStarted: boolean) => {
        this.setState({ isStarted });
      });
    } else {
      GimbalAirshipAdapter.stop();
      GimbalAirshipAdapter.isStarted().then((isStarted: boolean) => {
        this.setState({ isStarted });
      });
    }
  }

  handlePlacesConsent(enabled: boolean) {
    if (enabled) {
      GimbalAirshipAdapter.setUserConsent(
        ConsentType.Places,
        ConsentState.Granted
      );
    } else {
      GimbalAirshipAdapter.setUserConsent(
        ConsentType.Places,
        ConsentState.Refused
      );
    }

    GimbalAirshipAdapter.getUserConsent(ConsentType.Places).then((consent) => {
      this.setState({ placesConsent: consent });
    });
  }

  componentDidMount() {
    // by default, custom entry and custom exit events are enabled, and region events are disabled
    // GimbalAirshipAdapter.setShouldTrackCustomEntryEvents(true);
    // GimbalAirshipAdapter.setShouldTrackCustomExitEvents(true);
    // GimbalAirshipAdapter.setShouldTrackRegionEvents(false);

    GimbalAirshipAdapter.isStarted().then((isStarted) => {
      console.log(`GimbalAirshipAdapter started? ${isStarted}`);
      this.setState({ isStarted });
    });

    GimbalAirshipAdapter.getGdprConsentRequirement().then(
      (gdprConsentRequirement) => {
        this.setState({ gdprConsentRequirement });
      }
    );

    GimbalAirshipAdapter.getUserConsent(ConsentType.Places).then((consent) => {
      this.setState({ placesConsent: consent });
    });

    Airship.push.enableUserNotifications().then((isEnabled) => {
      console.log(`Airship push enabled? ${isEnabled}`);
    });

    Airship.channel.getChannelId().then((channelId: any) => {
      console.log(`Airship channelId: ${channelId}`);
      this.setState({ channelId });
    });

    Airship.addListener(
      EventType.ChannelCreated,
      (event: { channelId: any }) => {
        this.setState({ channelId: event.channelId });
      }
    );

    GimbalAirshipAdapter.addListener(RegionEventType.Enter, (event) => {
      console.log('region enter:', JSON.stringify(event));
    });

    GimbalAirshipAdapter.addListener(RegionEventType.Exit, (event) => {
      console.log('region exit:', JSON.stringify(event));
    });
  }

  render() {
    return (
      <View style={styles.backgroundContainer}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Image
            style={{
              width: 300,
              height: 38,
              marginTop: 50,
              alignItems: 'center',
            }}
            source={require('../img/urban-airship-sidebyside.png')}
          />
          <View style={{ height: 75 }} />
          <EnableGimbalAdapter
            isStarted={this.state.isStarted}
            handleStartAdapter={this.handleStartAdapter}
          />
          <View>
            <Text style={styles.text}>
              Airship Channel ID {'\n'} {this.state.channelId}
            </Text>
          </View>

          <View style={{ height: 75 }} />
          <PlacesConsentAdapter
            placesConsent={this.state.placesConsent}
            handlePlacesConsent={this.handlePlacesConsent}
          />
          <View>
            <Text style={styles.text}>
              GDPR Consent Requirement {this.state.gdprConsentRequirement}
            </Text>
            <Text style={styles.text}>
              Places Consent {this.state.placesConsent}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

interface EnableGimbalAdapterState {}
interface EnableGimbalAdapterProps {
  handleStartAdapter: (enabled: boolean) => void;
  isStarted: boolean;
}
class EnableGimbalAdapter extends Component<
  EnableGimbalAdapterProps,
  EnableGimbalAdapterState
> {
  render() {
    return (
      <View style={styles.cellContainer}>
        <Text style={styles.rowLabel}>Enable Gimbal Adapter</Text>
        <Switch
          trackColor={{ true: '#0d6a83', false: null }}
          onValueChange={(value) => this.props.handleStartAdapter(value)}
          value={this.props.isStarted}
        />
      </View>
    );
  }
}

interface PlacesConsentAdapterState {}
interface PlacesConsentAdapterProps {
  handlePlacesConsent: (enabled: boolean) => void;
  placesConsent: ConsentState | null;
}
class PlacesConsentAdapter extends Component<
  PlacesConsentAdapterProps,
  PlacesConsentAdapterState
> {
  render() {
    return (
      <View style={styles.cellContainer}>
        <Text style={styles.rowLabel}>Consent to Gimbal Places</Text>
        <Switch
          trackColor={{ true: '#0d6a83', false: null }}
          onValueChange={(value) => this.props.handlePlacesConsent(value)}
          value={this.props.placesConsent === ConsentState.Granted}
        />
      </View>
    );
  }
}
