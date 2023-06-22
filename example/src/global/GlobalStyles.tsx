import { StyleSheet } from 'react-native';
import { getFontSize } from './FontUtils';

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
    flexGrow: 1,
    paddingBottom: 20,
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
  listContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color_white,
    marginTop: 15,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 10,
  },
  tableSeparator: {
    backgroundColor: color_dark_blue,
    height: 0.5,
  },
  text: {
    fontFamily: 'BrandonText-Regular',
    fontSize: getFontSize(16),
    color: color_dark_blue,
    textAlign: 'center',
    padding: 5,
  },
  header: {
    fontFamily: 'BrandonText-Bold',
    fontSize: getFontSize(24),
    fontWeight: 'bold',
    color: color_orange,
    textAlign: 'center',
    padding: 10,
  },
  rowLabel: {
    fontFamily: 'BrandonText-Light',
    flexDirection: 'row',
    color: color_dark_blue,
    fontSize: getFontSize(12),
    marginRight: 10,
  },
});

export default GlobalStyles;
