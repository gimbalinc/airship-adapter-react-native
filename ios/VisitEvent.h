#import <Foundation/Foundation.h>
#import "AdapterEventEmitter.h"
#import <Gimbal/Gimbal.h>

/**
 * Gimbal visit events.
 */
@interface VisitEvent : NSObject<GimbalEvent>

/**
 * Creates an enter visit event.
 * @param visit The visit.
 * @return A react-native event.
 */
+ (instancetype)enterEventWithVisit:(GMBLVisit *)visit;

/**
 * Creates an exit visit event.
 * @param visit The visit.
 * @return A react-native event.
 */
+ (instancetype)exitEventWithVisit:(GMBLVisit *)visit;

/**
 * Returns the string name for region_enter events.
 * @return A NSString name for entrance events.
 */
+ (NSString *)enterEventName;

/**
 * Returns the string name for region_exit events.
 * @return A NSString name for exit events.
 */
+ (NSString *)exitEventName;

@end
