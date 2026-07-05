import Foundation

// Wraps a Shop with display-only fields derived locally or from Google Places.
// TODO: once GET /shops/nearby returns opening hours, remove isOpen/closingTime
//       and derive them from an OpeningHours model on Shop instead.
//       distanceMi stays local (computed from device location).
//       palIdx can stay local or be assigned server-side — TBD.
struct ShopDisplay: Identifiable {
    let shop: Shop

    // Computed from device location — never from API
    var distanceMi: Double?

    // From Google Places opening hours — move to Shop once backend proxies it
    var isOpen: Bool
    var closingTime: String

    // Palette index for PolaroidView colour — derived from shop.id
    var palIdx: Int

    var id: String { shop.id }
    var name: String { shop.name }
    var address: String { shop.address }
    var latitude: Double { shop.latitude }
    var longitude: Double { shop.longitude }
    var voteCount: Int { shop.voteCount }
    var photoUrl: String? { shop.photoUrl }
    var addedByUsername: String { shop.addedByUsername }

    // "address · 0.2mi", or just the address before distance is known
    var addressLine: String {
        guard let distanceMi else { return address }
        return "\(address) · \(StringUtils.formatMiles(distanceMi))"
    }

    init(shop: Shop, distanceMi: Double? = nil, isOpen: Bool = false, closingTime: String = "", palIdx: Int? = nil) {
        self.shop = shop
        self.distanceMi = distanceMi
        self.isOpen = isOpen
        self.closingTime = closingTime
        self.palIdx = palIdx ?? (abs(shop.id.hashValue) % Palette.polCount)
    }
}
