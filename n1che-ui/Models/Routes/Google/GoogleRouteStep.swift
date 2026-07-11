struct GoogleRouteStep: Decodable {
    let distanceMeters: Double?
    let staticDuration: String?
    let polyline: GooglePolyline?
    let navigationInstruction: GoogleNavigationInstruction?
}
