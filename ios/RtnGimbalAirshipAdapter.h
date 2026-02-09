#import <React/RCTEventEmitter.h>
#import "VisitEvent.h"
#import "GimbalService.h"
#import "AdapterEventEmitter.h"
#import "RtnGimbalAirshipAdapterSpec/RtnGimbalAirshipAdapterSpec.h"

@interface RtnGimbalAirshipAdapter : NSObject <NativeGimbalAirshipAdapterModuleSpec, GMBLPlaceManagerDelegate>
@end
