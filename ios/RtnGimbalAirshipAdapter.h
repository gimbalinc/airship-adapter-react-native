#import <React/RCTEventEmitter.h>
#import "VisitEvent.h"
#import "GimbalService.h"
#import "AdapterEventEmitter.h"
#import "RNRtnGimbalAirshipAdapterSpec.h"

@interface RtnGimbalAirshipAdapter : NSObject <NativeGimbalAirshipAdapterModuleSpec, GMBLPlaceManagerDelegate>
@end
