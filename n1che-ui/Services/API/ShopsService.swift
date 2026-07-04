import Foundation

// TODO: inject APIClient and call GET /shops/nearby once the backend exists.
// Method signatures are final — only the bodies change when networking lands.
final class ShopsService {
    func fetchNearbyShops(latitude: Double, longitude: Double, limit: Int) async throws -> [Shop] {
        MockShopData.shops
    }

    func fetchSplashShops() async throws -> [Shop] {
        MockShopData.shops
    }
}
