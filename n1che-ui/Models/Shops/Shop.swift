import Foundation

// TODO: shape mirrors POST /shops request & GET /shops/nearby response — update fields when API is finalised
struct Shop: Identifiable, Codable {
    let id: String
    let googlePlaceId: String
    let name: String
    let niche: String
    let address: String
    let latitude: Double
    let longitude: Double
    var voteCount: Int
    let createdAt: String
    let addedByUserId: String
    var addedByUsername: String
    var photoUrl: String?
}
