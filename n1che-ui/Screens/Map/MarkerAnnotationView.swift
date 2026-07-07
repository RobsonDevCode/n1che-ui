import MapKit
import SwiftUI

final class MarkerAnnotationView: MKAnnotationView {
    static let reuseID = "MarkerAnnotationView"

    private static let dimAnimDuration: TimeInterval = 0.2

    private var host: UIHostingController<MapMarkerView>?

    func configure(_ state: MarkerViewState) {
        let marker = MapMarkerView(shop: state.shop, index: state.index, selected: state.selected)
        if let host {
            host.rootView = marker
        } else {
            let controller = UIHostingController(rootView: marker)
            controller.view.backgroundColor = .clear
            addSubview(controller.view)
            host = controller
        }
        guard let host else { return }

        let size = host.sizeThatFits(in: UIView.layoutFittingCompressedSize)
        bounds = CGRect(origin: .zero, size: size)
        host.view.frame = bounds
        // Anchor bottom-centre: the pin tip sits on the coordinate
        centerOffset = CGPoint(x: 0, y: -size.height / 2)

        guard alpha != state.alpha else { return }
        UIView.animate(withDuration: Self.dimAnimDuration) {
            self.alpha = state.alpha
        }
    }
}
