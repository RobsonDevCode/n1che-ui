import CoreLocation
import Observation

@MainActor
@Observable
final class LocationViewModel: NSObject {
    private(set) var coordinate: Coordinate? = nil
    private(set) var label = ""
    private(set) var isLoading = true

    @ObservationIgnored private let manager = CLLocationManager()
    @ObservationIgnored private let geocodingService = GeocodingService()

    override init() {
        super.init()
        manager.desiredAccuracy = kCLLocationAccuracyHundredMeters
        manager.delegate = self
    }

    private func handleAuthorization(_ status: CLAuthorizationStatus) {
        switch status {
        case .notDetermined:
            manager.requestWhenInUseAuthorization()
        case .authorizedWhenInUse, .authorizedAlways:
            manager.requestLocation()
        default:
            isLoading = false
        }
    }

    private func handleFix(_ fix: Coordinate) {
        coordinate = fix
        Task {
            label = await geocodingService.areaLabel(latitude: fix.latitude, longitude: fix.longitude)
            isLoading = false
        }
    }
}

extension LocationViewModel: CLLocationManagerDelegate {
    nonisolated func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        let status = manager.authorizationStatus
        Task { @MainActor in handleAuthorization(status) }
    }

    nonisolated func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let coordinate = locations.last?.coordinate else { return }
        let fix = Coordinate(latitude: coordinate.latitude, longitude: coordinate.longitude)
        Task { @MainActor in handleFix(fix) }
    }

    nonisolated func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        Task { @MainActor in isLoading = false }
    }
}
