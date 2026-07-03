import Foundation

struct RouteStep: Codable {
    let distanceMeters: Double
    let durationSeconds: Int
    let polyline: [Coordinate]
    let instruction: String
    let maneuver: String
}
