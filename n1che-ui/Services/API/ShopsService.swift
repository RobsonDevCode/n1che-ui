import Foundation

// TODO: inject APIClient and call GET /shops/nearby once the backend exists.
// Method signatures are final — only the bodies change when networking lands.
final class ShopsService {
    func fetchNearbyShops(latitude: Double, longitude: Double, niche: String, limit: Int) async throws -> [Shop] {
        let matching = MockShopData.shops.filter { $0.niche == niche }
        return matching.isEmpty ? MockShopData.shops : matching
    }

    func fetchSplashShops() async throws -> [Shop] {
        MockShopData.shops
    }

    // TODO: POST /shops with googlePlaceId, name, address, lat/lng, niche
    func saveShop(_ shop: Shop) async throws {}
}
