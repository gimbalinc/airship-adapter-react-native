#import "VisitEvent.h"

static NSDateFormatter *dateFormatter;
static dispatch_once_t dateFormatterCreation;

@interface VisitEvent()
@property (nonatomic, strong) GMBLVisit *visit;
@property (nonatomic, strong) NSString *name;
@end

@implementation VisitEvent

static NSString* EVENT_NAME_REGION_ENTER = @"com.urbanairship.gimbal.region_enter";
static NSString* EVENT_NAME_REGION_EXIT = @"com.urbanairship.gimbal.region_exit";

- (instancetype)initWithVisit:(GMBLVisit *)visit name:(NSString *)name {
    self = [super init];
    if (self) {
        self.visit = visit;
        self.name = name;
    }
    return self;
}

+ (instancetype)enterEventWithVisit:(GMBLVisit *)visit {
    return [[self alloc] initWithVisit:visit name:EVENT_NAME_REGION_ENTER];
}

+ (instancetype)exitEventWithVisit:(GMBLVisit *)visit {
    return [[self alloc] initWithVisit:visit name:EVENT_NAME_REGION_EXIT];
}

+ (NSString *)enterEventName {
    return EVENT_NAME_REGION_ENTER;
}

+ (NSString *)exitEventName {
    return EVENT_NAME_REGION_EXIT;
}

- (NSString *)eventName {
    return self.name;
}

- (id)eventBody {
    NSDateFormatter *dateFormatter = [VisitEvent dateFormatter];
    NSMutableDictionary *visit = [NSMutableDictionary dictionary];
    [visit setValue:self.visit.visitID forKey:@"identifier"];

    [visit setValue:[dateFormatter stringFromDate:self.visit.departureDate] forKey:@"departureTime"];
    [visit setValue:[dateFormatter stringFromDate:self.visit.arrivalDate] forKey:@"arrivalTime"];
    [visit setValue:@(self.visit.dwellTime ?: 0) forKey:@"dwellTime"];

    if (self.visit.place) {
        NSMutableDictionary *place = [NSMutableDictionary dictionary];
        [place setValue:self.visit.place.identifier forKey:@"identifier"];
        [place setValue:self.visit.place.name forKey:@"name"];


        NSMutableDictionary *attributes = [NSMutableDictionary dictionary];
        for (NSString *key in self.visit.place.attributes.allKeys) {
            [attributes setValue:[self.visit.place.attributes stringForKey:key] forKey:key];
        }

        [place setValue:attributes forKey:@"attributes"];
        [visit setValue:place forKey:@"place"];
    }

    return visit;
}

+ (NSDateFormatter *)dateFormatter {
    dispatch_once(&dateFormatterCreation, ^{
        dateFormatter = [[NSDateFormatter alloc] init];
        NSLocale *enUSPOSIXLocale = [[NSLocale alloc] initWithLocaleIdentifier:@"en_US_POSIX"];
        [dateFormatter setLocale:enUSPOSIXLocale];
        [dateFormatter setTimeStyle:NSDateFormatterFullStyle];
        dateFormatter.dateFormat = @"yyyy-MM-dd'T'HH:mm:ss";
        [dateFormatter setTimeZone:[NSTimeZone timeZoneForSecondsFromGMT:0]];
    });

    return dateFormatter;
}

@end
