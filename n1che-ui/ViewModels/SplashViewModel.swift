import Foundation
import Observation

@MainActor
@Observable
final class SplashViewModel {
    var shops: [ShopDisplay] = []

    // Soho — central enough to get a good spread of shops
    private static let searchLatitude = 51.5138
    private static let searchLongitude = -0.1396
    private static let searchRadiusMeters: Double = 800
    private static let maxShops = 8
    private static let photoMaxWidthPx = 400

    private let shopsService: ShopsService
    private let placesService: PlacesService

    init(shopsService: ShopsService = ShopsService(), placesService: PlacesService = PlacesService()) {
        self.shopsService = shopsService
        self.placesService = placesService
    }

    func loadShops() async {
        let base = (try? await shopsService.fetchSplashShops()) ?? []
        let shops = (try? await placeBackedShops(base: base)) ?? base
        self.shops = shops.enumerated().map { i, shop in
            ShopDisplay(shop: shop, palIdx: i % Palette.polCount)
        }
    }

    // Real nearby places layered over the mock scaffold — vote counts and
    // usernames stay mocked until the backend exists.
    private func placeBackedShops(base: [Shop]) async throws -> [Shop] {
        guard !base.isEmpty else { return base }
        let places = try await placesService.searchNearby(
            latitude: Self.searchLatitude,
            longitude: Self.searchLongitude,
            radiusMeters: Self.searchRadiusMeters,
            maxResults: Self.maxShops
        )
        guard !places.isEmpty else { return base }

        return places.enumerated().map { i, place in
            let mock = base[i % base.count]
            return Shop(
                id: place.id,
                googlePlaceId: place.id,
                name: place.displayName?.text ?? mock.name,
                niche: mock.niche,
                address: place.formattedAddress ?? mock.address,
                latitude: place.location?.latitude ?? mock.latitude,
                longitude: place.location?.longitude ?? mock.longitude,
                voteCount: mock.voteCount,
                createdAt: mock.createdAt,
                addedByUserId: mock.addedByUserId,
                addedByUsername: mock.addedByUsername,
                photoUrl: place.photos?.first.flatMap {
                    placesService.photoURL(for: $0, maxWidthPx: Self.photoMaxWidthPx)?.absoluteString
                }
            )
        }
    }
}
