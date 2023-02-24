#import "GimbalService.h"
#import <Foundation/Foundation.h>

#if __has_include("AirshipLib.h")
#import "AirshipLib.h"
#else
@import AirshipKit;
#endif

@interface GimbalService() <GMBLPlaceManagerDelegate>
@property (nonatomic, strong) GMBLPlaceManager *placeManager;
@property (nonatomic) GMBLDeviceAttributesManager * deviceAttributesManager;
@end

NSString *const GimbalSource = @"Gimbal";

// MARK: NSUserDefault Keys
// TODO: Use Custom Defaults Suite
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

+ (void)load {
    [[NSNotificationCenter defaultCenter] addObserver:[GimbalService class]
                                             selector:@selector(handleAirshipReady)
                                                 name:@"com.urbanairship.airship_ready"
                                               object:nil];
}

+ (void)handleAirshipReady {
    [[GimbalService shared] updateDeviceAttributes];
}

// MARK: Lifecycle

- (instancetype)init {
    self = [super init];
    if (self) {
        if (self.gimbalApiKey) {
            [Gimbal setAPIKey:self.gimbalApiKey options:nil];
        }

        self.placeManager = [[GMBLPlaceManager alloc] init];
        self.placeManager.delegate = self;
        self.deviceAttributesManager = [[GMBLDeviceAttributesManager alloc] init];

        // Hide the power alert by default
        if (![[NSUserDefaults standardUserDefaults] valueForKey:GimbalAlertViewKey]) {
            [[NSUserDefaults standardUserDefaults] setBool:YES forKey:GimbalAlertViewKey];
        }

        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(updateDeviceAttributes)
                                                     name:UAChannel.channelCreatedEvent
                                                   object:nil];

        if ([[NSUserDefaults standardUserDefaults] boolForKey:GimbalServiceStartedKey]) {
            [self start];
        }
    }

    return self;
}

- (void)dealloc {
    self.placeManager.delegate = nil;
}

// MARK: Setters

- (void)setGimbalApiKey:(NSString *)gimbalApiKey {

    if (gimbalApiKey) {
        [[NSUserDefaults standardUserDefaults] setValue:gimbalApiKey forKey:GimbalServiceApiKey];
        [Gimbal setAPIKey:gimbalApiKey options:nil];
    } else {
        [[NSUserDefaults standardUserDefaults] removeObjectForKey:GimbalServiceApiKey];
    }
}

- (void)setBluetoothPoweredOffAlertEnabled:(BOOL)bluetoothPoweredOffAlertEnabled {
    [[NSUserDefaults standardUserDefaults] setBool:!bluetoothPoweredOffAlertEnabled
                                            forKey:GimbalAlertViewKey];
}

// MARK: Getters

- (NSString *)gimbalApiKey {
    return [[NSUserDefaults standardUserDefaults] valueForKey:GimbalServiceApiKey];
}

- (BOOL)isBluetoothPoweredOffAlertEnabled {
    return ![[NSUserDefaults standardUserDefaults] boolForKey:GimbalAlertViewKey];
}

- (BOOL)isStarted {
    return [[NSUserDefaults standardUserDefaults] boolForKey:GimbalServiceStartedKey] && [Gimbal isStarted];
}

// MARK: Gimbal Methods

- (void)start {
    [Gimbal start];

    [[NSUserDefaults standardUserDefaults] setBool:YES forKey:GimbalServiceStartedKey];

    [self updateDeviceAttributes];
    UA_LDEBUG(@"Started Gimbal Adapter. Gimbal application instance identifier: %@", [Gimbal applicationInstanceIdentifier]);
}

- (void)stop {
    [Gimbal stop];
    [[NSUserDefaults standardUserDefaults] setBool:NO forKey:GimbalServiceStartedKey];
    UA_LDEBUG(@"Stopped Gimbal Adapter.");
}

- (void)updateDeviceAttributes {
    NSMutableDictionary *deviceAttributes = [NSMutableDictionary dictionary];

    if ([self.deviceAttributesManager getDeviceAttributes].count) {
        [deviceAttributes addEntriesFromDictionary:[self.deviceAttributesManager getDeviceAttributes]];
    }

    [deviceAttributes setValue:[UAirship contact].namedUserID forKey:@"ua.nameduser.id"];
    [deviceAttributes setValue:[UAirship channel].identifier forKey:@"ua.channel.id"];

    if (deviceAttributes.count) {
        [self.deviceAttributesManager setDeviceAttributes:deviceAttributes];
        UA_LDEBUG(@"Set Gimbal Device Attributes: %@", [deviceAttributes description]);
    }

    UAAssociatedIdentifiers *identifiers = [UAirship.analytics currentAssociatedDeviceIdentifiers];
    [identifiers setIdentifier:[Gimbal applicationInstanceIdentifier] forKey:@"com.urbanairship.gimbal.aii"];
    [UAirship.analytics associateDeviceIdentifiers:identifiers];
}

// MARK: PlaceManager Delegate Methods

- (void)placeManager:(GMBLPlaceManager *)manager didBeginVisit:(GMBLVisit *)visit {
    UA_LDEBUG(@"Entered a Gimbal Place: %@ on the following date: %@", visit.place.name, visit.arrivalDate);
    UARegionEvent *regionEvent = [UARegionEvent regionEventWithRegionID:visit.place.identifier
                                                                 source:GimbalSource
                                                          boundaryEvent:UABoundaryEventEnter];

    [UAirship.analytics addEvent:regionEvent];

    id strongDelegate = self.delegate;
    if ([strongDelegate respondsToSelector:@selector(placeManager:didBeginVisit:)]) {
        [strongDelegate placeManager:manager didBeginVisit:visit];
    }
}

- (void)placeManager:(GMBLPlaceManager *)manager didEndVisit:(GMBLVisit *)visit {
    if (!self.isStarted) {
        return;
    }

    UA_LDEBUG(@"Exited a Gimbal Place: %@ Entrance date:%@ Exit Date:%@", visit.place.name, visit.arrivalDate, visit.departureDate);
    UARegionEvent *regionEvent = [UARegionEvent regionEventWithRegionID:visit.place.identifier
                                                                 source:GimbalSource
                                                          boundaryEvent:UABoundaryEventExit];
    [UAirship.analytics addEvent:regionEvent];

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
