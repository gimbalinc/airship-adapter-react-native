import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import AdapterEventUtils from '../../services/AdapterEvents/AdapterEventUtils';
import type AdapterEvent from '../../services/AdapterEvents/AdapterEvent';

import {
  GimbalAirshipAdapter,
  RegionEventType,
} from 'rtn-gimbal-airship-adapter';
import GlobalStyles from '../../global/GlobalStyles';

const dummyEvent: AdapterEvent = {
  description: 'awaiting events',
  regionEvent: '',
};

const EventTranscriptContainer = () => {
  const [newestEvent, setNewestEvent] = useState(dummyEvent);

  useEffect(() => {
    GimbalAirshipAdapter.addListener(RegionEventType.Enter, (event) => {
      console.log('region enter:', JSON.stringify(event));
      const newEvent = AdapterEventUtils.regionEventToAdapterEvent(event);
      console.log(`newEvent: ${JSON.stringify(newEvent)}`);
      setNewestEvent(newEvent);
    });

    GimbalAirshipAdapter.addListener(RegionEventType.Exit, (event) => {
      console.log('region exit:', JSON.stringify(event));
      const newEvent = AdapterEventUtils.regionEventToAdapterEvent(event);
      console.log(`newEvent: ${JSON.stringify(newEvent)}`);
      setNewestEvent(newEvent);
    });
  });

  return (
    <View style={GlobalStyles.cellContainer}>
      <Text style={GlobalStyles.rowLabel}>{newestEvent.description}</Text>
    </View>
  );
};

export default EventTranscriptContainer;
