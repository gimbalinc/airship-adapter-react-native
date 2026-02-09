#import "RtnGimbalAirshipAdapter.h"

@implementation RtnGimbalAirshipAdapter

// MARK: Module setup
RCT_EXPORT_MODULE()

- (instancetype)init
{
    self = [super init];
    if (self) {
        [GimbalService shared].delegate = self;
    }
    return self;
}

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

- (void)setBridge:(RCTBridge *)bridge {
    [AdapterEventEmitter shared].bridge = bridge;
}

- (RCTBridge *)bridge {
    return [AdapterEventEmitter shared].bridge;
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[
        VisitEvent.enterEventName,
        VisitEvent.exitEventName
    ];
}

// MARK: Module methods

RCT_EXPORT_METHOD(addListener:(NSString *)eventName) {
    [[AdapterEventEmitter shared] addListener:eventName];
}

RCT_EXPORT_METHOD(removeListeners:(double)count) {
    [[AdapterEventEmitter shared] removeListeners:count];
}

// Android-specific methods (no-op on iOS)
RCT_EXPORT_METHOD(addAndroidListener:(NSString *)eventName) {
    // No-op on iOS, only used on Android
}

RCT_EXPORT_METHOD(removeAndroidListeners:(double)count) {
    // No-op on iOS, only used on Android
}

RCT_REMAP_METHOD(setApiKey,
                 setApiKey:(NSString *)gimbalApiKey) {
    [[GimbalService shared] setApiKey:gimbalApiKey];
}

RCT_REMAP_METHOD(start,
                 start:(NSString *)gimbalApiKey
                 resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject) {
    [[GimbalService shared] start:gimbalApiKey];
    resolve(@([[GimbalService shared] isStarted]));
}

RCT_EXPORT_METHOD(stop) {
    [[GimbalService shared] stop];
}

RCT_REMAP_METHOD(isStarted,
                 isStarted:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject) {
    resolve(@([GimbalService shared].isStarted));
}

RCT_REMAP_METHOD(getGdprConsentRequirement,
                 getGdprConsentRequirement:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject) {
    GDPRConsentRequirement requirement = [GMBLPrivacyManager gdprConsentRequirement];
    resolve([self convertConsentRequirement:requirement]);
}

RCT_REMAP_METHOD(getUserConsent,
                 getUserConsent:(NSString *)type
                 resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject) {
    GMBLConsentState state = [GMBLPrivacyManager userConsentFor:[self convertConsentTypeString:type]];

    resolve([self convertConsentState:state]);
}

RCT_REMAP_METHOD(setUserConsent,
                 setUserConsent:(NSString *)type
                 state:(NSString *)state) {
    [GMBLPrivacyManager setUserConsentFor:[self convertConsentTypeString:type]
                                  toState:[self convertConsentStateString:state]];
}

RCT_EXPORT_METHOD(setShouldTrackCustomEntryEvents:(BOOL)shouldTrack) {
    [[GimbalService shared] setShouldTrackCustomEntryEvents:shouldTrack];
}

RCT_EXPORT_METHOD(setShouldTrackCustomExitEvents:(BOOL)shouldTrack) {
    [[GimbalService shared] setShouldTrackCustomExitEvents:shouldTrack];
}

RCT_EXPORT_METHOD(setShouldTrackRegionEvents:(BOOL)shouldTrack) {
    [[GimbalService shared] setShouldTrackRegionEvents:shouldTrack];
}

RCT_EXPORT_METHOD(setAnalyticsId:(NSString *)id) {
    [[GimbalService shared] setAnalyticsId:id];
}

// MARK: Gimbal PlaceManagerDelegate

- (void)placeManager:(GMBLPlaceManager *)manager didBeginVisit:(GMBLVisit *)visit {
    VisitEvent *event = [VisitEvent enterEventWithVisit:visit];
    [[AdapterEventEmitter shared] sendEvent:event];
}

- (void)placeManager:(GMBLPlaceManager *)manager didEndVisit:(GMBLVisit *)visit {
    VisitEvent *event = [VisitEvent exitEventWithVisit:visit];
    [[AdapterEventEmitter shared] sendEvent:event];
}

// MARK: Utility Methods

- (GMBLConsentType)convertConsentTypeString:(NSString *)consentType {
    if ([consentType isEqualToString:@"places"]) {
        return GMBLPlacesConsent;
    }
    return GMBLPlacesConsent;
}

- (GMBLConsentState)convertConsentStateString:(NSString *)consentState {
    if ([consentState isEqualToString:@"granted"]) {
        return GMBLConsentGranted;
    } else if ([consentState isEqualToString:@"refused"]) {
        return GMBLConsentRefused;
    } else {
        return GMBLConsentUnknown;
    }
}

- (NSString *)convertConsentState:(GMBLConsentState)consentState {
    switch (consentState) {
        case GMBLConsentGranted:
            return @"granted";
        case GMBLConsentRefused:
            return @"refused";
        case GMBLConsentUnknown:
            return @"unknown";
        default:
            return nil;

    }
}

- (NSString *)convertConsentRequirement:(GDPRConsentRequirement)consentRequirement {
    switch (consentRequirement) {
        case GMBLGDPRConsentRequired:
            return @"required";
        case GMBLGDPRConsentNotRequired:
            return @"notRequired";
        case GMBLGDPRConsentRequirementUnknown:
            return @"unknown";
        default:
            return nil;
    }
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeGimbalAirshipAdapterModuleSpecJSI>(params);
}

@end
