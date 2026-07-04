// Google Routes API Maneuver enum (routes.legs.steps.navigationInstruction.maneuver).
// unknown catches values added to the API after this was written.
enum Maneuver: String, Codable {
    case turnLeft = "TURN_LEFT"
    case turnRight = "TURN_RIGHT"
    case turnSlightLeft = "TURN_SLIGHT_LEFT"
    case turnSlightRight = "TURN_SLIGHT_RIGHT"
    case turnSharpLeft = "TURN_SHARP_LEFT"
    case turnSharpRight = "TURN_SHARP_RIGHT"
    case uturnLeft = "UTURN_LEFT"
    case uturnRight = "UTURN_RIGHT"
    case straight = "STRAIGHT"
    case rampLeft = "RAMP_LEFT"
    case rampRight = "RAMP_RIGHT"
    case merge = "MERGE"
    case roundaboutLeft = "ROUNDABOUT_LEFT"
    case roundaboutRight = "ROUNDABOUT_RIGHT"
    case ferry = "FERRY"
    case ferryTrain = "FERRY_TRAIN"
    case nameChange = "NAME_CHANGE"
    case depart = "DEPART"
    case arrive = "ARRIVE"
    case unknown = "MANEUVER_UNSPECIFIED"

    init(from decoder: Decoder) throws {
        let raw = try decoder.singleValueContainer().decode(String.self)
        self = Maneuver(rawValue: raw) ?? .unknown
    }
}
