import UIKit
import React
import React_RCTAppDelegate
import Gimbal
import AirshipKit

@main
class AppDelegate: RCTAppDelegate, UNUserNotificationCenterDelegate {
  
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Set the module name
    self.moduleName = "RtnGimbalAirshipAdapterExample"
    
    // Call super FIRST to initialize React Native bridge
    let result = super.application(application, didFinishLaunchingWithOptions: launchOptions)
    
    // THEN initialize Airship after RN bridge is ready
    do {
        let config = try AirshipConfig.default()
        try Airship.takeOff(config, launchOptions: launchOptions)
        print("Airship.takeOff succeeded")
    } catch {
        print("Airship.takeOff failed: \(error)")
    }
    
    UNUserNotificationCenter.current().delegate = self
    
    return result
  }

  override func bundleURL() -> URL? {
    #if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
  
  func concurrentRootEnabled() -> Bool {
    return true
  }

  override func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
  ) {
    super.application(application, didRegisterForRemoteNotificationsWithDeviceToken: deviceToken)
    Gimbal.setPushDeviceToken(deviceToken)
  }

  override func application(
    _ application: UIApplication,
    didFailToRegisterForRemoteNotificationsWithError error: Error
  ) {
    super.application(application, didFailToRegisterForRemoteNotificationsWithError: error)
    print("Registration for remote notifications failed with error \(error.localizedDescription)")
  }
}
