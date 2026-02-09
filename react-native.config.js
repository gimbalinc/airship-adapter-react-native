const path = require('path');

module.exports = {
  dependency: {
    platforms: {
      android: {
        sourceDir: path.join(__dirname, 'android'),
        packageImportPath: 'import com.rtngimbalairshipadapter.RtnGimbalAirshipAdapterPackage;',
        packageInstance: 'new RtnGimbalAirshipAdapterPackage()',
        libraryName: 'RtnGimbalAirshipAdapter',
      },
      ios: {},
    },
  },
};
