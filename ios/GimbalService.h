#import <Foundation/Foundation.h>
#import <Gimbal/Gimbal.h>

@interface GimbalService : NSObject

/**
 * Returns true if the service is started, otherwise false.
 */
@property (nonatomic, readonly, getter=isStarted) BOOL started;

/**
 * Enables alert when Bluetooth is powered off. Defaults to NO.
 */
@property (nonatomic, assign, getter=isBluetoothPoweredOffAlertEnabled) BOOL bluetoothPoweredOffAlertEnabled;

/**
 * Receives forwarded callbacks from the GMBLPlaceManagerDelegate
 */
@property (nonatomic, weak) id<GMBLPlaceManagerDelegate> _Nullable delegate;

/**
 * Returns the shared `GimbalService` instance.
 *
 * @return The shared `GimbalAdapter` instance.
 */
+ (instancetype _Nonnull )shared;

/**
 * Starts the service.
 *
 * @return Boolean indicating whether or not the Adapter was started.
 */
- (BOOL)start:(NSString* _Nonnull)apiKey;

/**
 * Stops the service.
 */
- (void)stop;


@end
