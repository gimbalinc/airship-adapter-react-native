const ReactNative = require('react-native');
if (ReactNative.ErrorUtils) {
  const prev = ReactNative.ErrorUtils.getGlobalHandler();
  ReactNative.ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error('JS Error:', error?.message, error?.stack);
    if (prev) prev(error, isFatal);
  });
}
