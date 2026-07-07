import MapKit

// One-shot camera instruction for MapKitView. A fresh id per command lets the
// coordinator apply each command exactly once even though SwiftUI re-runs
// updateUIView many times.
struct MapCameraCommand: Equatable {
    let id = UUID()
    let center: CLLocationCoordinate2D
    let span: MKCoordinateSpan
    let duration: TimeInterval

    var region: MKCoordinateRegion {
        MKCoordinateRegion(center: center, span: span)
    }

    static func == (lhs: MapCameraCommand, rhs: MapCameraCommand) -> Bool {
        lhs.id == rhs.id
    }
}
