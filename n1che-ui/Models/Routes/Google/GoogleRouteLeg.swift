struct GoogleRouteLeg: Decodable {
    let distanceMeters: Double?
    let duration: String?
    let polyline: GooglePolyline?
    let steps: [GoogleRouteStep]?
}
