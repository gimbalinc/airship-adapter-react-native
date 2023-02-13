#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNRtnGimbalAirshipAdapterSpec.h"

@interface RtnGimbalAirshipAdapter : NSObject <NativeGimbalAirshipAdapterSpec,GMBLPlaceManagerDelegate>
#else
#import <React/RCTBridgeModule.h>

@interface RtnGimbalAirshipAdapter : RCTEventEmitter <RCTBridgeModule, GMBLPlaceManagerDelegate>
#endif

@end
