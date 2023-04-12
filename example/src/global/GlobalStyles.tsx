import { StyleSheet } from 'react-native';

const GlobalStyles = StyleSheet.create({
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
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

export default GlobalStyles;
