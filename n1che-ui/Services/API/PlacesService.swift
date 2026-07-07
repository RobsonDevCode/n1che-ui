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

    func searchNearby(
        latitude: Double,
        longitude: Double,
        radiusMeters: Double,
        maxResults: Int
    ) async throws -> [Place] {
        guard !AppConfig.googlePlacesAPIKey.isEmpty else {
            throw PlacesServiceError.missingAPIKey
        }

        var request = URLRequest(url: Self.searchNearbyURL)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(AppConfig.googlePlacesAPIKey, forHTTPHeaderField: "X-Goog-Api-Key")
        request.setValue(Self.searchFieldMask, forHTTPHeaderField: "X-Goog-FieldMask")
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
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(PlaceSearchResponse.self, from: data).places ?? []
    }

    func searchText(query: String, near coordinate: Coordinate?) async throws -> [Place] {
        guard !AppConfig.googlePlacesAPIKey.isEmpty else {
            throw PlacesServiceError.missingAPIKey
        }

        var request = URLRequest(url: Self.searchTextURL)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(AppConfig.googlePlacesAPIKey, forHTTPHeaderField: "X-Goog-Api-Key")
        request.setValue(Self.searchFieldMask, forHTTPHeaderField: "X-Goog-FieldMask")
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
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(PlaceSearchResponse.self, from: data).places ?? []
    }

    func autocomplete(query: String) async throws -> [PlacePrediction] {
        guard !AppConfig.googlePlacesAPIKey.isEmpty else {
            throw PlacesServiceError.missingAPIKey
        }

        var request = URLRequest(url: Self.autocompleteURL)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(AppConfig.googlePlacesAPIKey, forHTTPHeaderField: "X-Goog-Api-Key")
        request.setValue(Self.autocompleteFieldMask, forHTTPHeaderField: "X-Goog-FieldMask")
        let body: [String: Any] = [
            "input": query,
            "includedPrimaryTypes": ["geocode"],
        ]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, _) = try await URLSession.shared.data(for: request)
        let response = try JSONDecoder().decode(PlaceAutocompleteResponse.self, from: data)
        return (response.suggestions ?? []).map(\.placePrediction)
    }

    func photoURL(for photo: PlacePhoto, maxWidthPx: Int) -> URL? {
        URL(string: "\(Self.photoBaseURL)/\(photo.name)/media?maxWidthPx=\(maxWidthPx)&key=\(AppConfig.googlePlacesAPIKey)")
    }
}
