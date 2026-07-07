// POST https://places.googleapis.com/v1/places:autocomplete response envelope.
// Google omits the field entirely when there are no matches.
struct PlaceAutocompleteResponse: Codable {
    let suggestions: [PlaceSuggestion]?
}
