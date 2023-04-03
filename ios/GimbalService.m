#import "GimbalService.h"
#import <Foundation/Foundation.h>
@import GimbalAirshipAdapter;

@interface GimbalService() <GMBLPlaceManagerDelegate>
@property (nonatomic, strong) GMBLPlaceManager *placeManager;
@end

NSString *const GimbalSource = @"Gimbal";

// MARK: NSUserDefault Keys
NSString *const GimbalAlertViewKey = @"gmbl_hide_bt_power_alert_view";
NSString *const GimbalServiceStartedKey = @"com.urbanairship.gimbal.started";
NSString *const GimbalServiceApiKey = @"com.urbanairship.gimbal.api_key";

@implementation GimbalService

static id _sharedObject = nil;

+ (instancetype)shared {
    static dispatch_once_t onceToken = 0;
    dispatch_once(&onceToken, ^{
        _sharedObject = [[self alloc] init];
    });
    return _sharedObject;
}

// MARK: Lifecycle

- (instancetype)init {
    self = [super init];
    if (self) {
        AirshipAdapter.shared.delegate = self;
        AirshipAdapter.shared.shouldTrackCustomEntryEvents = true;
        AirshipAdapter.shared.shouldTrackCustomExitEvents = true;
        [AirshipAdapter.shared restore];
    }

    return self;
}

- (void)dealloc {
    self.placeManager.delegate = nil;
}

// MARK: Setters

- (void)setBluetoothPoweredOffAlertEnabled:(BOOL)bluetoothPoweredOffAlertEnabled {
    [AirshipAdapter.shared setBluetoothPoweredOffAlertEnabled:bluetoothPoweredOffAlertEnabled];
}

// MARK: Getters

- (BOOL)isStarted {
    return [AirshipAdapter.shared isStarted];
}

// MARK: Gimbal Methods

- (BOOL)start:(NSString *)apiKey {
    [AirshipAdapter.shared start:apiKey];
    return [AirshipAdapter.shared isStarted];
}

- (void)stop {
    [AirshipAdapter.shared stop];
}

// MARK: PlaceManager Delegate Methods

- (void)placeManager:(GMBLPlaceManager *)manager didBeginVisit:(GMBLVisit *)visit {
    id strongDelegate = self.delegate;
    if ([strongDelegate respondsToSelector:@selector(placeManager:didBeginVisit:)]) {
        [strongDelegate placeManager:manager didBeginVisit:visit];
    }
}

- (void)placeManager:(GMBLPlaceManager *)manager didEndVisit:(GMBLVisit *)visit {
    if (!self.isStarted) {
        return;
    }

    id strongDelegate = self.delegate;
    if ([strongDelegate respondsToSelector:@selector(placeManager:didEndVisit:)]) {
        [strongDelegate placeManager:manager didEndVisit:visit];
    }
}

- (void)placeManager:(GMBLPlaceManager *)manager didBeginVisit:(GMBLVisit *)visit withDelay:(NSTimeInterval)delayTime {
    if (!self.isStarted) {
        return;
    }

    id strongDelegate = self.delegate;
    if ([strongDelegate respondsToSelector:@selector(placeManager:didBeginVisit:withDelay:)]) {
        [strongDelegate placeManager:manager didBeginVisit:visit withDelay:delayTime];
    }
}

- (void)placeManager:(GMBLPlaceManager *)manager didReceiveBeaconSighting:(GMBLBeaconSighting *)sighting forVisits:(NSArray *)visits {
    if (!self.isStarted) {
        return;
    }
    id strongDelegate = self.delegate;
    if ([strongDelegate respondsToSelector:@selector(placeManager:didReceiveBeaconSighting:forVisits:)]) {
        [strongDelegate placeManager:manager didReceiveBeaconSighting:sighting forVisits:visits];
    }
}

- (void)placeManager:(GMBLPlaceManager *)manager didDetectLocation:(CLLocation *)location {
    if (!self.isStarted) {
        return;
    }
    id strongDelegate = self.delegate;
    if ([strongDelegate respondsToSelector:@selector(placeManager:didDetectLocation:)]) {
        [strongDelegate placeManager:manager didDetectLocation:location];
    }
}

@end
