#import <Foundation/Foundation.h>
#import <Gimbal/Gimbal.h>

@interface GimbalService : NSObject

/**
 * Returns true if the service is started, otherwise false.
 */
@property (nonatomic, readonly, getter=isStarted) BOOL started;

/**
 * Enables / disables the creation of an Airship CustomEvent upon place entry. Tracking is enabled by default.
 */
-(void)setShouldTrackCustomEntryEvents:(BOOL)shouldTrack;

/**
 * Enables / disables the creation of an Airship CustomEvent upon place exit. Tracking is enabled by default.
 */
-(void)setShouldTrackCustomExitEvents:(BOOL)shouldTrack;

/**
 * Enables / disables the creation of an Airship RegionEvent upon place entry and exit. Tracking is disabled by default, since RegionEvents are
 * deprecated in favor of CustomEvents.
 */
-(void)setShouldTrackRegionEvents:(BOOL)shouldTrack;

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
 * Sets the Gimbal API Key.
 *
 *@param apiKey Your Gimbal API Key
 */
-(void)setApiKey:(NSString *)apiKey;

/**
 * Associates a User Analytics Identifier with an application instance.  This may be used to
 * enrich exported analytics events from Gimbal Manager.
 *
 * @param id - the User Analytics Identifier
*/
-(void)setAnalyticsId:(NSString *)id;

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
