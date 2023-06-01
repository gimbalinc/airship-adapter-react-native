import React, { useState, useEffect } from 'react';
import { View, Text, Switch } from 'react-native';
import {
  ConsentState,
  ConsentType,
  GimbalAirshipAdapter,
} from 'rtn-gimbal-airship-adapter';
import GlobalStyles from '../../global/GlobalStyles';

const SetConsentToggle = () => {
  const [placesConsent, setPlacesConsent] = useState(ConsentState.Unknown);

  useEffect(() => {
    if (!GimbalAirshipAdapter.isStarted) {
      return;
    }

    GimbalAirshipAdapter.getUserConsent(ConsentType.Places).then(
      (consentState) => {
        setPlacesConsent(consentState);
      }
    );
  }, [placesConsent]);

  const handleConsentToggle = (enabled: boolean) => {
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

    GimbalAirshipAdapter.getUserConsent(ConsentType.Places).then(
      (consentState) => {
        setPlacesConsent(consentState);
      }
    );
  };

  return (
    <View style={GlobalStyles.cellContainer}>
      <Text style={GlobalStyles.text}>ConsentState: {placesConsent}</Text>
      <Switch
        trackColor={{ true: '#0d6a83', false: null }}
        onValueChange={handleConsentToggle}
        value={placesConsent === ConsentState.Granted}
      />
    </View>
  );
};

export default SetConsentToggle;
