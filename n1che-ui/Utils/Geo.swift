import CoreLocation

enum Geo {
    private static let compassPoints = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    private static let degreesPerPoint: Double = 45
    private static let metersPerMile: Double = 1_609.344

    static func miles(from: Coordinate, to: Coordinate) -> Double {
        let origin = CLLocation(latitude: from.latitude, longitude: from.longitude)
        let target = CLLocation(latitude: to.latitude, longitude: to.longitude)
        return target.distance(from: origin) / metersPerMile
    }

    // nil for negative headings (CoreLocation reports -1 when heading is unavailable)
    static func headingToCompass(_ heading: Double) -> String? {
        guard heading >= 0 else { return nil }
        return compassPoints[Int((heading / degreesPerPoint).rounded()) % compassPoints.count]
    }
}
