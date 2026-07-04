enum Geo {
    private static let compassPoints = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    private static let degreesPerPoint: Double = 45

    // nil for negative headings (CoreLocation reports -1 when heading is unavailable)
    static func headingToCompass(_ heading: Double) -> String? {
        guard heading >= 0 else { return nil }
        return compassPoints[Int((heading / degreesPerPoint).rounded()) % compassPoints.count]
    }
}
