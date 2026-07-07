import MapKit

enum Maps {
    // Smallest region containing every coordinate, grown by paddingFactor for
    // breathing room and never tighter than minimumSpan. nil when empty.
    static func region(
        enclosing coordinates: [Coordinate],
        paddingFactor: Double,
        minimumSpan: MKCoordinateSpan
    ) -> MKCoordinateRegion? {
        guard let first = coordinates.first else { return nil }
        var minLat = first.latitude, maxLat = first.latitude
        var minLng = first.longitude, maxLng = first.longitude
        for coordinate in coordinates {
            minLat = min(minLat, coordinate.latitude)
            maxLat = max(maxLat, coordinate.latitude)
            minLng = min(minLng, coordinate.longitude)
            maxLng = max(maxLng, coordinate.longitude)
        }
        return MKCoordinateRegion(
            center: CLLocationCoordinate2D(latitude: (minLat + maxLat) / 2, longitude: (minLng + maxLng) / 2),
            span: MKCoordinateSpan(
                latitudeDelta: max((maxLat - minLat) * paddingFactor, minimumSpan.latitudeDelta),
                longitudeDelta: max((maxLng - minLng) * paddingFactor, minimumSpan.longitudeDelta)
            )
        )
    }
}
