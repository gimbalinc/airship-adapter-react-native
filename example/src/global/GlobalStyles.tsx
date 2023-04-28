import { StyleSheet } from 'react-native';

const color_dark_blue = 'rgb(37 49 59)';
const color_orange = 'rgb(249 102 85)';
const color_white = 'rgb(255 255 255)';

const GlobalStyles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: color_white,
  },
  contentContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: color_white,
  },
  cellContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color_white,
    marginTop: 15,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 10,
  },
  text: {
    fontFamily: 'BrandonText-Regular',
    fontSize: 16,
    color: color_dark_blue,
    textAlign: 'center',
    padding: 10,
  },
  header: {
    fontFamily: 'BrandonText-Bold',
    fontSize: 24,
    fontWeight: 'bold',
    color: color_orange,
    textAlign: 'center',
    padding: 10,
  },
  rowLabel: {
    fontFamily: 'BrandonText-Light',
    flexDirection: 'row',
    color: color_dark_blue,
    fontSize: 16,
    marginRight: 10,
  },
});

export default GlobalStyles;
