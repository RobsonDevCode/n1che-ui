import Foundation

// Sole source of truth for the map screen's panel state — each mode decides
// which panel occupies the slot below the map and how tall the map is.
enum MapMode {
    case browse
    case shop
    case list
    case routePicker
    case routeBuilder
    case route
    case navigation
    // Searching for a place to add — map stays at browse height
    case addShop
    // A place is selected — AddShopPanel occupies the slot
    case addShopDetail

    var isAddingShop: Bool {
        self == .addShop || self == .addShopDetail
    }

    var showsSearchBar: Bool {
        switch self {
        case .browse, .shop, .list, .addShop, .addShopDetail:  true
        case .routePicker, .routeBuilder, .route, .navigation: false
        }
    }

    // Fraction of the screen height the map occupies in this mode
    var mapHeightRatio: CGFloat {
        switch self {
        case .browse, .addShop:                  0.78
        case .shop:                              0.28
        case .list:                              0.44
        case .routePicker, .routeBuilder, .route: 0.45
        case .navigation:                        0.55
        case .addShopDetail:                     0.52
        }
    }
}
