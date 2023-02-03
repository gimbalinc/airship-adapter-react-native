
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNRtnGimbalAirshipAdapterSpec.h"

@interface RtnGimbalAirshipAdapter : NSObject <NativeRtnGimbalAirshipAdapterSpec>
#else
#import <React/RCTBridgeModule.h>

@interface RtnGimbalAirshipAdapter : NSObject <RCTBridgeModule>
#endif

@end
