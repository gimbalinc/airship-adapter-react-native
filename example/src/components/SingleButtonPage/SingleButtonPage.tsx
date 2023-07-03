import { View, Text, Button } from 'react-native';
import GlobalStyles from '../../global/GlobalStyles';
import React from 'react';

type SingleButtonPageProps = {
  pageText: string;
  buttonText: string;
  buttonCallback: () => void;
};

const SingleButtonPage = ({
  pageText,
  buttonText,
  buttonCallback,
}: SingleButtonPageProps) => {
  return (
    <View>
      <View style={{ height: 75 }} />
      <Text style={GlobalStyles.text}>{pageText}</Text>
      <Button title={buttonText} onPress={buttonCallback} />
    </View>
  );
};

export default SingleButtonPage;
