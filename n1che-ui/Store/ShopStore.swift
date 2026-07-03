import Foundation

@Observable
final class ShopStore {
    var nearbyShops: [ShopDisplay] = []
    var selectedShop: ShopDisplay? = nil
    var isLoading: Bool = false
}
