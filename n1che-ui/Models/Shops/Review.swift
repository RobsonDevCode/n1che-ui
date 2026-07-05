import Foundation

// TODO: shape mirrors GET /shops/:id/reviews and POST /shops/:id/reviews
struct Review: Identifiable, Codable {
    let id: String
    let shopId: String
    let user: String
    let date: String
    let text: String
}
