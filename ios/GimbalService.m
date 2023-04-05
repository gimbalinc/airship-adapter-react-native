#import "GimbalService.h"
#import <Foundation/Foundation.h>
@import GimbalAirshipAdapter;

@interface GimbalService() <GMBLPlaceManagerDelegate>
@property (nonatomic, strong) GMBLPlaceManager *placeManager;
@property (nonatomic, strong) NSUserDefaults *defaults;
@end

NSString *const GimbalSource = @"Gimbal";

// MARK: NSUserDefault Keys
NSString *const GimbalDidSetCustomEntryTrackingPreferenceKey =
    @"com.gimbal.rtn.airship.adapter.didset.custom.entry.tracking";
NSString *const GimbalDidSetCustomExitTrackingPreferenceKey =
    @"com.gimbal.rtn.airship.adapter.didset.custom.exit.tracking";
NSString *const GimbalDidSetRegionTrackingPreferenceKey =
    @"com.gimbal.rtn.airship.adapter.didset.region.tracking";
NSString *const defaultsSuiteName = @"com.gimbal.rtn.airship.adapter.suite.name";

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
        _defaults = [[NSUserDefaults alloc] initWithSuiteName:defaultsSuiteName];
        
        AirshipAdapter.shared.delegate = self;
        
        if (![self didSetCustomEntryTrackingPreference]) {
            AirshipAdapter.shared.shouldTrackCustomEntryEvents = true;
        }
        
        if (![self didSetCustomExitTrackingPreference]) {
            AirshipAdapter.shared.shouldTrackCustomExitEvents = true;
        }
        
        if (![self didSetRegionEventTrackingPreference]) {
            AirshipAdapter.shared.shouldTrackRegionEvents = false;
        }
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

-(void)setShouldTrackCustomEntryEvents:(BOOL)shouldTrack {
    [self.defaults setBool:true forKey:GimbalDidSetCustomEntryTrackingPreferenceKey];
    AirshipAdapter.shared.shouldTrackCustomEntryEvents = shouldTrack;
}

-(void)setShouldTrackCustomExitEvents:(BOOL)shouldTrack {
    [self.defaults setBool:true forKey:GimbalDidSetCustomExitTrackingPreferenceKey];
    AirshipAdapter.shared.shouldTrackCustomExitEvents = shouldTrack;
}

-(void)setShouldTrackRegionEvents:(BOOL)shouldTrack {
    [self.defaults setBool:true forKey:GimbalDidSetRegionTrackingPreferenceKey];
    AirshipAdapter.shared.shouldTrackRegionEvents = shouldTrack;
}

// MARK: Gimbal Methods

- (BOOL)start:(NSString *)apiKey {
    [AirshipAdapter.shared start:apiKey];
    return [AirshipAdapter.shared isStarted];
}

- (void)stop {
    [AirshipAdapter.shared stop];
}

// MARK: misc
-(BOOL)didSetCustomEntryTrackingPreference {
    return [self.defaults boolForKey:GimbalDidSetCustomEntryTrackingPreferenceKey];
}

-(BOOL)didSetCustomExitTrackingPreference {
    return [self.defaults boolForKey:GimbalDidSetCustomExitTrackingPreferenceKey];
}

-(BOOL)didSetRegionEventTrackingPreference {
    return [self.defaults boolForKey:GimbalDidSetRegionTrackingPreferenceKey];
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
