import MapKit

final class ShopAnnotation: NSObject, MKAnnotation {
    let shop: ShopDisplay
    let index: Int

    var coordinate: CLLocationCoordinate2D {
        CLLocationCoordinate2D(latitude: shop.latitude, longitude: shop.longitude)
    }

    init(shop: ShopDisplay, index: Int) {
        self.shop = shop
        self.index = index
    }
}
