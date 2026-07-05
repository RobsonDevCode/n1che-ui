// POST https://places.googleapis.com/v1/places:searchNearby response envelope
struct PlaceSearchResponse: Codable {
    let places: [Place]?
}
