#import <React/RCTEventEmitter.h>
#import "VisitEvent.h"
#import "GimbalService.h"
#import "AdapterEventEmitter.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNRtnGimbalAirshipAdapterSpec.h"

@interface RtnGimbalAirshipAdapter : NSObject <NativeGimbalAirshipAdapterSpec,GMBLPlaceManagerDelegate>
#else
#import <React/RCTBridgeModule.h>
#import <Gimbal/Gimbal.h>

@interface RtnGimbalAirshipAdapter : RCTEventEmitter <RCTBridgeModule, GMBLPlaceManagerDelegate>
#endif

@end
