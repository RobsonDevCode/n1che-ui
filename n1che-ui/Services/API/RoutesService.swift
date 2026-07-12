import Foundation

// Google Routes API — builds waypoints from stops and maps the response into the
// app's route model. Transport (headers, key, decoding) lives in GoogleAPIClient.
final class RoutesService {
    private static let computeRoutesURL = URL(string: "https://routes.googleapis.com/directions/v2:computeRoutes")!
    private static let fieldMask = [
        "routes.distanceMeters",
        "routes.duration",
        "routes.polyline",
        "routes.legs.distanceMeters",
        "routes.legs.duration",
        "routes.legs.polyline",
        "routes.legs.steps.distanceMeters",
        "routes.legs.steps.staticDuration",
        "routes.legs.steps.polyline",
        "routes.legs.steps.navigationInstruction",
    ].joined(separator: ",")
    private static let browseMinutesPerStop = 15
    private static let secondsPerMinute: Double = 60

    private let client: GoogleAPIClient

    init(client: GoogleAPIClient = .shared) {
        self.client = client
    }

    // A hand-built route through an ordered set of stops.
    func computeRoute(
        stops: [RouteStop],
        origin: Coordinate?,
        mode: RouteMode,
        name: String,
        tag: String,
        createdBy: String,
        userId: String
    ) async throws -> RouteResponse {
        try await buildRoute(
            id: UUID().uuidString, stops: stops, origin: origin, mode: mode,
            name: name, tag: tag, createdBy: createdBy, userId: userId
        )
    }

    // A single-stop route from the user's location.
    func directRoute(
        to shop: ShopDisplay,
        origin: Coordinate?,
        createdBy: String,
        userId: String
    ) async throws -> RouteResponse {
        let stop = RouteStop(shop: shop)
        return try await buildRoute(
            id: "direct-\(shop.id)", stops: [stop], origin: origin, mode: .you,
            name: shop.name.uppercased(), tag: "DIRECT", createdBy: createdBy, userId: userId
        )
    }

    private func buildRoute(
        id: String,
        stops: [RouteStop],
        origin: Coordinate?,
        mode: RouteMode,
        name: String,
        tag: String,
        createdBy: String,
        userId: String
    ) async throws -> RouteResponse {
        guard !stops.isEmpty else { throw ProblemDetails.invalidRequest }
        let waypoints = Self.orderedWaypoints(stops: stops, origin: origin, mode: mode)
        guard waypoints.count >= 2,
              let originWaypoint = waypoints.first,
              let destinationWaypoint = waypoints.last else {
            throw ProblemDetails.invalidRequest
        }

        let requestBody: [String: Any] = [
            "origin": Self.encodeWaypoint(originWaypoint),
            "destination": Self.encodeWaypoint(destinationWaypoint),
            "intermediates": waypoints.dropFirst().dropLast().map(Self.encodeWaypoint),
            "travelMode": "WALK",
            "polylineEncoding": "GEO_JSON_LINESTRING",
            "computeAlternativeRoutes": false,
            "languageCode": "en-GB",
            "units": "METRIC",
        ]
        let response: GoogleRoutesResponse = try await client.post(
            Self.computeRoutesURL, fieldMask: Self.fieldMask, body: requestBody
        )
        guard let googleRoute = response.routes?.first else { throw ProblemDetails.noResults }

        return Self.mapToRouteResponse(
            id: id, googleRoute: googleRoute, stops: stops, mode: mode, includesOrigin: origin != nil,
            name: name, tag: tag, createdBy: createdBy, userId: userId
        )
    }

    private static func mapToRouteResponse(
        id: String,
        googleRoute: GoogleRoute,
        stops: [RouteStop],
        mode: RouteMode,
        includesOrigin: Bool,
        name: String,
        tag: String,
        createdBy: String,
        userId: String
    ) -> RouteResponse {
        var stopsWithLegs = stops
        let googleLegs = googleRoute.legs ?? []
        switch mode {
        case .you:
            // With an origin, leg i arrives at stop i; without one the route
            // starts at stop 0, so leg i arrives at stop i + 1.
            let arrivalOffset = includesOrigin ? 0 : 1
            for legIndex in googleLegs.indices where legIndex + arrivalOffset < stopsWithLegs.count {
                stopsWithLegs[legIndex + arrivalOffset].leg = mapRouteLeg(googleLegs[legIndex])
            }
        case .loop:
            // Leg i leaves stop i; attach it to the stop it arrives at.
            for legIndex in googleLegs.indices {
                let arrivingStopIndex = (legIndex + 1) % stopsWithLegs.count
                stopsWithLegs[arrivingStopIndex].leg = mapRouteLeg(googleLegs[legIndex])
            }
        }

        let walkingMinutes = Int((parseDurationSeconds(googleRoute.duration) / secondsPerMinute).rounded())
        let totalMinutes = walkingMinutes + stopsWithLegs.count * browseMinutesPerStop

        return RouteResponse(
            id: id, name: name, tag: tag, createdBy: createdBy, userId: userId,
            stops: stopsWithLegs,
            polyline: coordinates(fromPolyline: googleRoute.polyline),
            distanceMeters: googleRoute.distanceMeters ?? 0,
            totalUpvotes: stopsWithLegs.reduce(0) { $0 + $1.voteCount },
            totalMinutes: totalMinutes,
            mode: mode
        )
    }

    private static func orderedWaypoints(stops: [RouteStop], origin: Coordinate?, mode: RouteMode) -> [Coordinate] {
        let stopCoordinates = stops.map { Coordinate(latitude: $0.latitude, longitude: $0.longitude) }
        switch mode {
        case .you:
            guard let origin else { return stopCoordinates }
            return [origin] + stopCoordinates
        case .loop:
            guard let firstStop = stopCoordinates.first else { return stopCoordinates }
            return stopCoordinates + [firstStop]
        }
    }

    private static func encodeWaypoint(_ coordinate: Coordinate) -> [String: Any] {
        ["location": ["latLng": ["latitude": coordinate.latitude, "longitude": coordinate.longitude]]]
    }

    private static func mapRouteLeg(_ googleLeg: GoogleRouteLeg) -> RouteLeg {
        RouteLeg(
            distanceMeters: googleLeg.distanceMeters ?? 0,
            durationSeconds: Int(parseDurationSeconds(googleLeg.duration).rounded()),
            polyline: coordinates(fromPolyline: googleLeg.polyline),
            steps: (googleLeg.steps ?? []).map(mapRouteStep)
        )
    }

    private static func mapRouteStep(_ googleStep: GoogleRouteStep) -> RouteStep {
        RouteStep(
            distanceMeters: googleStep.distanceMeters ?? 0,
            durationSeconds: Int(parseDurationSeconds(googleStep.staticDuration).rounded()),
            polyline: coordinates(fromPolyline: googleStep.polyline),
            instruction: googleStep.navigationInstruction?.instructions ?? "",
            maneuver: googleStep.navigationInstruction?.maneuver ?? Maneuver.unknown.rawValue
        )
    }

    private static func coordinates(fromPolyline polyline: GooglePolyline?) -> [Coordinate] {
        (polyline?.geoJsonLinestring?.coordinates ?? []).compactMap { longitudeLatitudePair in
            guard longitudeLatitudePair.count >= 2 else { return nil }
            return Coordinate(latitude: longitudeLatitudePair[1], longitude: longitudeLatitudePair[0])
        }
    }

    // Google encodes durations as protobuf seconds, e.g. "620s".
    private static func parseDurationSeconds(_ duration: String?) -> Double {
        guard let duration else { return 0 }
        return Double(duration.replacingOccurrences(of: "s", with: "")) ?? 0
    }
}
