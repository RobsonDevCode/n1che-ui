import Foundation

struct RouteLeg: Codable {
    let distanceMeters: Double
    let durationSeconds: Int
    let polyline: [Coordinate]
    let steps: [RouteStep]
}
