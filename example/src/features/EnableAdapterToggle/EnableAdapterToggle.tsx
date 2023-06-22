import React, { useState, useEffect } from 'react';
import { View, Text, Switch } from 'react-native';
import { GimbalAirshipAdapter } from 'rtn-gimbal-airship-adapter';
import GlobalStyles from '../../global/GlobalStyles';

type EnableToggleProps = {
  apiKey: string;
};

const EnableAdapterToggle = ({ apiKey }: EnableToggleProps) => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      const isAdapterEnabled = await GimbalAirshipAdapter.isStarted();
      setIsEnabled(isAdapterEnabled);
    })();
  }, [apiKey, isEnabled]);

  const handleAdapterToggle = (switchValue: boolean) => {
    if (switchValue) {
      GimbalAirshipAdapter.start(apiKey).then((isStarted) => {
        setIsEnabled(isStarted);
      });
    } else {
      GimbalAirshipAdapter.stop();
      GimbalAirshipAdapter.isStarted().then((isStarted) => {
        console.log(`is adapter enabled? ${isStarted}`);
        setIsEnabled(isStarted);
      });
    }
  };

  return (
    <View style={GlobalStyles.cellContainer}>
      <Text style={GlobalStyles.text}>
        {isEnabled ? 'Disable Adapter?' : 'Enable Adapter?'}
      </Text>
      <Switch
        trackColor={{ true: '#0d6a83', false: null }}
        onValueChange={handleAdapterToggle}
        value={isEnabled}
      />
    </View>
  );
};

export default EnableAdapterToggle;
