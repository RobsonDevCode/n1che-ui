import Foundation

// Direct Google Places API (New) calls — client-side for now.
// TODO: move behind a backend proxy so the key leaves the client.
final class PlacesService {
    private static let searchNearbyURL = URL(string: "https://places.googleapis.com/v1/places:searchNearby")!
    private static let searchTextURL = URL(string: "https://places.googleapis.com/v1/places:searchText")!
    private static let autocompleteURL = URL(string: "https://places.googleapis.com/v1/places:autocomplete")!
    private static let textSearchMaxResults = 10
    private static let textSearchBiasRadiusMeters: Double = 50_000
    private static let photoBaseURL = "https://places.googleapis.com/v1"
    private static let searchFieldMask = "places.id,places.displayName,places.formattedAddress,places.location,places.photos,places.currentOpeningHours"
    private static let autocompleteFieldMask = "suggestions.placePrediction.placeId,suggestions.placePrediction.text"

    private let client: GoogleAPIClient

    init(client: GoogleAPIClient = .shared) {
        self.client = client
    }

    func searchNearby(
        latitude: Double,
        longitude: Double,
        radiusMeters: Double,
        maxResults: Int
    ) async throws -> [Place] {
        let body: [String: Any] = [
            "includedTypes": ["clothing_store"],
            "maxResultCount": maxResults,
            "locationRestriction": [
                "circle": [
                    "center": ["latitude": latitude, "longitude": longitude],
                    "radius": radiusMeters,
                ],
            ],
        ]
        let response: PlaceSearchResponse = try await client.post(
            Self.searchNearbyURL, fieldMask: Self.searchFieldMask, body: body
        )
        return response.places ?? []
    }

    func searchText(query: String, near coordinate: Coordinate?) async throws -> [Place] {
        var body: [String: Any] = [
            "textQuery": query,
            "maxResultCount": Self.textSearchMaxResults,
        ]
        if let coordinate {
            body["locationBias"] = [
                "circle": [
                    "center": ["latitude": coordinate.latitude, "longitude": coordinate.longitude],
                    "radius": Self.textSearchBiasRadiusMeters,
                ],
            ]
        }
        let response: PlaceSearchResponse = try await client.post(
            Self.searchTextURL, fieldMask: Self.searchFieldMask, body: body
        )
        return response.places ?? []
    }

    func autocomplete(query: String) async throws -> [PlacePrediction] {
        let body: [String: Any] = [
            "input": query,
            "includedPrimaryTypes": ["geocode"],
        ]
        let response: PlaceAutocompleteResponse = try await client.post(
            Self.autocompleteURL, fieldMask: Self.autocompleteFieldMask, body: body
        )
        return (response.suggestions ?? []).map(\.placePrediction)
    }

    func photoURL(for photo: PlacePhoto, maxWidthPx: Int) -> URL? {
        URL(string: "\(Self.photoBaseURL)/\(photo.name)/media?maxWidthPx=\(maxWidthPx)&key=\(AppConfig.googleAPIKey)")
    }
}
