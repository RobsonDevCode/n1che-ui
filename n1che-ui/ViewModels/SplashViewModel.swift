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
    // Places has no photo filter — over-fetch, then drop photo-less places locally
    private static let searchResultCount = 20
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
            maxResults: Self.searchResultCount
        )
        let withPhotos = places.filter { $0.photos?.isEmpty == false }.prefix(Self.maxShops)
        guard !withPhotos.isEmpty else { return base }

        return withPhotos.enumerated().map { i, place in
            let photoUrl = place.photos?.first.flatMap {
                placesService.photoURL(for: $0, maxWidthPx: Self.photoMaxWidthPx)?.absoluteString
            }
            return base[i % base.count].overlaying(place, photoUrl: photoUrl)
        }
    }
}
