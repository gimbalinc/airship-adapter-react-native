import React, { Component } from 'react';
import { FlatList, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdapterEventUtils from '../../services/AdapterEvents/AdapterEventUtils';
import type AdapterEvent from '../../services/AdapterEvents/AdapterEvent';

import {
  GimbalAirshipAdapter,
  RegionEventType,
} from 'rtn-gimbal-airship-adapter';
import GlobalStyles from '../../global/GlobalStyles';

const KEY_EVENTS = 'adapterEventsKey';

interface EventTranscriptContainerProps {}

interface EventTranscriptContainerState {
  events: AdapterEvent[];
}

const ListItem = ({ event }: { event: AdapterEvent }) => (
  <Text style={GlobalStyles.rowLabel}>{event.description}</Text>
);

const ListHeader = () => <Text style={GlobalStyles.header}>Events</Text>;

export default class EventTranscriptContainer extends Component<
  EventTranscriptContainerProps,
  EventTranscriptContainerState
> {
  constructor(props: EventTranscriptContainerProps) {
    super(props);

    this.state = {
      events: [],
    };

    this.saveEvent = this.saveEvent.bind(this);
  }

  componentDidMount(): void {
    AsyncStorage.getItem(KEY_EVENTS).then((jsonEvents) => {
      if (jsonEvents == null) {
        console.log('EventTrascriptContainer no saved events found');
      } else {
        const parsedEvents: [AdapterEvent] = JSON.parse(jsonEvents);
        if (!Array.isArray(parsedEvents)) {
          throw new Error(`Parsed events in incorrect format: ${jsonEvents}`);
        }

        this.setState({ events: parsedEvents });
      }
    });

    GimbalAirshipAdapter.addListener(RegionEventType.Enter, (event) => {
      const newEvent = AdapterEventUtils.regionEventToAdapterEvent(event);
      console.log(`newEvent: ${newEvent.description}`);
      this.saveEvent(newEvent);
    });

    GimbalAirshipAdapter.addListener(RegionEventType.Exit, (event) => {
      const newEvent = AdapterEventUtils.regionEventToAdapterEvent(event);
      console.log(`newEvent: ${newEvent.description}`);
      this.saveEvent(newEvent);
    });
  }

  saveEvent(event: AdapterEvent) {
    let events = this.state.events;
    events.push(event);
    const updatedJsonEvents = JSON.stringify(events);
    AsyncStorage.setItem(KEY_EVENTS, updatedJsonEvents)
      .then(() => {
        this.setState({ events });
      })
      .catch((error) => {
        console.log(`Error saving new event ${event}: ${error}`);
        events.pop();
      });
  }

  render() {
    return (
      <View style={GlobalStyles.cellContainer}>
        <FlatList
          contentContainerStyle={GlobalStyles.contentContainer}
          data={this.state.events}
          renderItem={({ item }) => <ListItem event={item} />}
          keyExtractor={(item: AdapterEvent) => item.regionEvent}
          ListHeaderComponent={ListHeader}
        />
      </View>
    );
  }
}
