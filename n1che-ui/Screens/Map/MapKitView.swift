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
    // Full route geometry (active route / navigation) and a lighter builder preview
    var routePolyline: [Coordinate] = []
    var previewPolyline: [Coordinate] = []
    // Height of a panel overlaying the map bottom — camera fits above it
    var cameraBottomInset: CGFloat = 0
    let onSelect: (String) -> Void
    let onRegionChange: (MKCoordinateRegion) -> Void

    // Route is drawn as a wide casing under a narrower core; preview is thinner.
    private static let routeCasingColor = UIColor(Color.pinColors[1])
    private static let routeCoreColor = UIColor(Color.polPalette[4])
    private static let routeCasingWidth: CGFloat = 9
    private static let routeCoreWidth: CGFloat = 5
    private static let previewCasingWidth: CGFloat = 7
    private static let previewCoreWidth: CGFloat = 4

    private enum RouteOverlayLevel: String {
        case routeCasing, routeCore, previewCasing, previewCore

        // Casing levels share one colour; core levels share the other.
        var strokeColor: UIColor {
            switch self {
            case .routeCasing, .previewCasing: MapKitView.routeCasingColor
            case .routeCore, .previewCore:     MapKitView.routeCoreColor
            }
        }

        var lineWidth: CGFloat {
            switch self {
            case .routeCasing:   MapKitView.routeCasingWidth
            case .routeCore:     MapKitView.routeCoreWidth
            case .previewCasing: MapKitView.previewCasingWidth
            case .previewCore:   MapKitView.previewCoreWidth
            }
        }
    }

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
        coordinator.syncOverlays(on: map, route: routePolyline, preview: previewPolyline)
        coordinator.apply(cameraCommand, to: map)
    }

    final class Coordinator: NSObject, MKMapViewDelegate {
        var parent: MapKitView

        private var lastShopIds: [String] = []
        private var lastSelectedId: String? = nil
        private var lastCameraCommandId: UUID? = nil
        private var lastRoutePolyline: [Coordinate] = []
        private var lastPreviewPolyline: [Coordinate] = []

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
            let bottomInset = parent.cameraBottomInset
            UIView.animate(withDuration: command.duration) {
                if bottomInset > 0 {
                    map.setVisibleMapRect(
                        Maps.mapRect(for: command.region),
                        edgePadding: UIEdgeInsets(top: 0, left: 0, bottom: bottomInset, right: 0),
                        animated: true
                    )
                } else {
                    map.setRegion(command.region, animated: true)
                }
            }
        }

        func syncOverlays(on map: MKMapView, route: [Coordinate], preview: [Coordinate]) {
            guard route != lastRoutePolyline || preview != lastPreviewPolyline else { return }
            lastRoutePolyline = route
            lastPreviewPolyline = preview
            map.removeOverlays(map.overlays)
            addLayeredPolyline(route, casing: .routeCasing, core: .routeCore, to: map)
            addLayeredPolyline(preview, casing: .previewCasing, core: .previewCore, to: map)
        }

        // Casing added first so the narrower core draws on top of it.
        private func addLayeredPolyline(
            _ coordinates: [Coordinate],
            casing: RouteOverlayLevel,
            core: RouteOverlayLevel,
            to map: MKMapView
        ) {
            guard coordinates.count >= 2 else { return }
            map.addOverlay(makePolyline(coordinates, level: casing))
            map.addOverlay(makePolyline(coordinates, level: core))
        }

        private func makePolyline(_ coordinates: [Coordinate], level: RouteOverlayLevel) -> MKPolyline {
            let points = coordinates.map { CLLocationCoordinate2D(latitude: $0.latitude, longitude: $0.longitude) }
            let polyline = MKPolyline(coordinates: points, count: points.count)
            polyline.title = level.rawValue
            return polyline
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

        func mapView(_ mapView: MKMapView, rendererFor overlay: MKOverlay) -> MKOverlayRenderer {
            guard let polyline = overlay as? MKPolyline,
                  let level = polyline.title.flatMap(RouteOverlayLevel.init(rawValue:)) else {
                return MKOverlayRenderer(overlay: overlay)
            }
            let renderer = MKPolylineRenderer(polyline: polyline)
            renderer.lineCap = .round
            renderer.lineJoin = .round
            renderer.strokeColor = level.strokeColor
            renderer.lineWidth = level.lineWidth
            return renderer
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
