struct NavProgress {
    var state: NavState
    var currentStopIndex: Int
    var currentInstruction: String
    var currentManeuver: Maneuver
    var nextInstruction: String
    var nextManeuver: Maneuver?
    var currentHeading: Double
    var distanceToNextTurnMeters: Double
    var distanceToNextStopMeters: Double
}
