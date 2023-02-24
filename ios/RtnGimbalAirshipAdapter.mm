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

RCT_EXPORT_METHOD(removeListeners:(NSInteger)count) {
    [[AdapterEventEmitter shared] removeListeners:count];
}

RCT_EXPORT_METHOD(setGimbalApiKey:(NSString *)gimbalApiKey) {
    [GimbalService shared].gimbalApiKey = gimbalApiKey;
}

RCT_REMAP_METHOD(start,
                 start_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {

    [[GimbalService shared] start];
    // TODO resolve reject based on the prompt
    resolve(@(YES));
}

RCT_EXPORT_METHOD(stop) {
    [[GimbalService shared] stop];
}

RCT_REMAP_METHOD(isStarted,
                 isStarted_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    resolve(@([GimbalService shared].isStarted));
}

RCT_REMAP_METHOD(getGdprConsentRequirement,
                 getGdprConsentRequirement_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    GDPRConsentRequirement requirement = [GMBLPrivacyManager gdprConsentRequirement];
    resolve([self convertConsentRequirement:requirement]);
}

RCT_REMAP_METHOD(getUserConsent,
                 getUserConsent_type:(NSString *)type
                 getUserConsent_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    GMBLConsentState state = [GMBLPrivacyManager userConsentFor:[self convertConsentTypeString:type]];

    resolve([self convertConsentState:state]);
}

RCT_EXPORT_METHOD(setUserConsent:(NSString *)type state:(NSString *)state) {
    [GMBLPrivacyManager setUserConsentFor:[self convertConsentTypeString:type]
                                  toState:[self convertConsentStateString:state]];
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

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeRtnGimbalAirshipAdapterSpecJSI>(params);
}
#endif

@end
