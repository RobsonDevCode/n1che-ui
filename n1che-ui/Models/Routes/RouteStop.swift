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

    init(shop: ShopDisplay) {
        id = shop.id
        name = shop.name
        address = shop.address
        latitude = shop.latitude
        longitude = shop.longitude
        voteCount = shop.voteCount
        isOpen = shop.isOpen
        palIdx = shop.palIdx
        leg = nil
    }
}
