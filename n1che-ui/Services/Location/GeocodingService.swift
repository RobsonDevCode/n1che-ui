import CoreLocation

final class GeocodingService {
    private let geocoder = CLGeocoder()

    func coordinate(for query: String) async -> Coordinate? {
        guard let location = (try? await geocoder.geocodeAddressString(query))?.first?.location else {
            return nil
        }
        return Coordinate(latitude: location.coordinate.latitude, longitude: location.coordinate.longitude)
    }

    func areaLabel(latitude: Double, longitude: Double) async -> String {
        let location = CLLocation(latitude: latitude, longitude: longitude)
        guard let placemark = (try? await geocoder.reverseGeocodeLocation(location))?.first else {
            return ""
        }
        let area = placemark.subLocality ?? placemark.subAdministrativeArea ?? placemark.locality
        return [area, placemark.isoCountryCode].compactMap { $0 }.joined(separator: ", ")
    }
}
