import Foundation

struct RouteStop: Identifiable, Codable {
    let id: String
    let name: String
    let address: String
    let latitude: Double
    let longitude: Double
    var voteCount: Int
    var isOpen: Bool
    var palIdx: Int
    var leg: RouteLeg?
}
