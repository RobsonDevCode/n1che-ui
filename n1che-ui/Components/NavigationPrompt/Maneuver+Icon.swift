extension Maneuver {
    var icon: AppIcon {
        switch self {
        case .turnLeft, .turnSlightLeft, .turnSharpLeft, .rampLeft:
            return .turnLeft
        case .turnRight, .turnSlightRight, .turnSharpRight, .rampRight:
            return .turnRight
        case .uturnLeft:
            return .uturnLeft
        case .uturnRight:
            return .uturnRight
        case .roundaboutLeft:
            return .roundaboutLeft
        case .roundaboutRight:
            return .roundaboutRight
        case .arrive:
            return .arrive
        case .straight, .merge, .depart, .ferry, .ferryTrain, .nameChange, .unknown:
            return .straight
        }
    }
}
