export enum RegionEventType {
  /**
   * Region enter.
   */
  Enter = 'regionEnter',

  /**
   * Region exit.
   */
  Exit = 'regionExit',
}

/**
 * Gimbal consent types.
 */
export enum ConsentType {
  /**
   * Indicates a choice for consent to Place Monitoring functionality
   */
  Places = 'places',
}

/**
 * Gimbal consent state.
 */
export enum ConsentState {
  /**
   * Unknown. Typically because the user has not yet been asked for consent.
   */
  Unknown = 'unknown',

  /**
   * Consent has been granted by the user.
   */
  Granted = 'granted',

  /**
   * Consent has been refused by the user
   */
  Refused = 'refused',
}

/**
 * GDPR consent requirement.
 */
export enum ConsentRequirement {
  /**
   * GDPR user consent status is not yet known - The Gimbal SDK has not yet been able to contact its server
   */
  Unknown = 'unknown',

  /**
   * GDPR user consent is required at this location
   */
  NotRequired = 'notRequired',

  /**
   * GDPR user consent is not required at this location - it may be required at a different location
   */
  Required = 'required',
}

/**
 * A Gimbal place.
 */
export interface Place {
  /**
   * The place's ID.
   */
  identifier: string;

  /**
   * The place's name.
   */
  name: string;

  /**
   * The place's attributes.
   */
  attribute: object;
}

/**
 * An event fired when a region is entered or exited.
 */
export interface RegionEvent {
  /**
   * The visit ID.
   */
  identifier: string;

  /**
   * Dwell time in seconds.
   */
  dwellTime: number;

  /**
   * The arrival time as an ISO 8601 timestamp.
   */
  arrivalTime: string;

  /**
   * The departure time aas an ISO 8601 timestamp.
   */
  departureTime?: string;

  /**
   * The place.
   */
  place: Place;
}
