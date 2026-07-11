struct GoogleRoute: Decodable {
    let distanceMeters: Double?
    let duration: String?
    let polyline: GooglePolyline?
    let legs: [GoogleRouteLeg]?
}
