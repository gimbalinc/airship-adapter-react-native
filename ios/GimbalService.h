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
@property (nonatomic, weak) id<GMBLPlaceManagerDelegate> delegate;

@property (nonatomic, copy, nullable) NSString *gimbalApiKey;

/**
 * Returns the shared `GimbalService` instance.
 *
 * @return The shared `GimbalAdapter` instance.
 */
+ (instancetype)shared;

/**
 * Starts the service.
 */
- (void)start;

/**
 * Stops the service.
 */
- (void)stop;


@end
