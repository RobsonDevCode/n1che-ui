import Foundation

// Everything MarkerAnnotationView needs to render one marker
struct MarkerViewState {
    let shop: ShopDisplay
    let index: Int
    let selected: Bool
    let alpha: CGFloat
}
