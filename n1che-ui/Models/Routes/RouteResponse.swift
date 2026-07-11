import Foundation

// TODO: shape mirrors GET /routes/suggestions response — update when backend endpoint is built
struct RouteResponse: Identifiable, Codable {
    let id: String
    let name: String
    let tag: String
    let createdBy: String
    let userId: String
    let stops: [RouteStop]
    let polyline: [Coordinate]
    let distanceMeters: Double
    let totalUpvotes: Int
    let totalMinutes: Int
    let mode: RouteMode
}
