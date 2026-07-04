// POST https://places.googleapis.com/v1/places:autocomplete response envelope
struct PlaceAutocompleteResponse: Codable {
    let suggestions: [PlaceSuggestion]
}
