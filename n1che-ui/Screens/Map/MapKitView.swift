import MapKit
import SwiftUI

struct MapKitView: UIViewRepresentable {
    let shops: [ShopDisplay]
    let selectedShopId: String?
    let cameraCommand: MapCameraCommand?
    let initialRegion: MKCoordinateRegion
    var isInteractive: Bool = true
    // Opacity for unselected markers while one is selected
    var dimmedMarkerAlpha: CGFloat = 0
    let onSelect: (String) -> Void
    let onRegionChange: (MKCoordinateRegion) -> Void

    func makeCoordinator() -> Coordinator {
        Coordinator(parent: self)
    }

    func makeUIView(context: Context) -> MKMapView {
        let map = MKMapView()
        let configuration = MKStandardMapConfiguration(emphasisStyle: .muted)
        configuration.pointOfInterestFilter = .excludingAll
        map.preferredConfiguration = configuration
        map.showsUserLocation = true
        map.showsCompass = false
        map.delegate = context.coordinator
        map.register(MarkerAnnotationView.self, forAnnotationViewWithReuseIdentifier: MarkerAnnotationView.reuseID)
        map.setRegion(initialRegion, animated: false)
        return map
    }

    func updateUIView(_ map: MKMapView, context: Context) {
        let coordinator = context.coordinator
        coordinator.parent = self
        map.isScrollEnabled = isInteractive
        map.isZoomEnabled = isInteractive
        map.isRotateEnabled = isInteractive
        map.isPitchEnabled = isInteractive
        coordinator.syncAnnotations(on: map, shops: shops)
        coordinator.syncSelection(on: map, selectedId: selectedShopId)
        coordinator.apply(cameraCommand, to: map)
    }

    final class Coordinator: NSObject, MKMapViewDelegate {
        var parent: MapKitView

        private var lastShopIds: [String] = []
        private var lastSelectedId: String? = nil
        private var lastCameraCommandId: UUID? = nil

        init(parent: MapKitView) {
            self.parent = parent
        }

        // Order-sensitive: markers carry their list rank, so a reorder must
        // rebuild them even when the same shops come back
        func syncAnnotations(on map: MKMapView, shops: [ShopDisplay]) {
            let ids = shops.map(\.id)
            guard ids != lastShopIds else { return }
            lastShopIds = ids
            map.removeAnnotations(map.annotations.compactMap { $0 as? ShopAnnotation })
            map.addAnnotations(shops.enumerated().map { ShopAnnotation(shop: $1, index: $0) })
        }

        func syncSelection(on map: MKMapView, selectedId: String?) {
            guard selectedId != lastSelectedId else { return }
            lastSelectedId = selectedId
            for annotation in map.annotations {
                guard let shopAnnotation = annotation as? ShopAnnotation,
                      let view = map.view(for: shopAnnotation) as? MarkerAnnotationView else { continue }
                configure(view, for: shopAnnotation)
            }
        }

        func apply(_ command: MapCameraCommand?, to map: MKMapView) {
            guard let command, command.id != lastCameraCommandId else { return }
            lastCameraCommandId = command.id
            UIView.animate(withDuration: command.duration) {
                map.setRegion(command.region, animated: true)
            }
        }

        private func configure(_ view: MarkerAnnotationView, for annotation: ShopAnnotation) {
            let selected = annotation.shop.id == parent.selectedShopId
            let dimmed = parent.selectedShopId != nil && !selected
            view.configure(MarkerViewState(
                shop: annotation.shop,
                index: annotation.index,
                selected: selected,
                alpha: dimmed ? parent.dimmedMarkerAlpha : 1
            ))
        }

        func mapView(_ mapView: MKMapView, viewFor annotation: MKAnnotation) -> MKAnnotationView? {
            guard let shopAnnotation = annotation as? ShopAnnotation else { return nil }
            let view = mapView.dequeueReusableAnnotationView(
                withIdentifier: MarkerAnnotationView.reuseID,
                for: shopAnnotation
            )
            view.canShowCallout = false
            if let markerView = view as? MarkerAnnotationView {
                configure(markerView, for: shopAnnotation)
            }
            return view
        }

        func mapView(_ mapView: MKMapView, didSelect view: MKAnnotationView) {
            guard let annotation = view.annotation as? ShopAnnotation else { return }
            // Clear MapKit's selection immediately so a second tap toggles
            mapView.deselectAnnotation(annotation, animated: false)
            parent.onSelect(annotation.shop.id)
        }

        func mapView(_ mapView: MKMapView, regionDidChangeAnimated animated: Bool) {
            parent.onRegionChange(mapView.region)
        }
    }
}
