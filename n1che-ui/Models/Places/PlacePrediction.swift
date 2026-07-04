struct PlacePrediction: Codable, Identifiable {
    let placeId: String
    let text: PlaceText

    var id: String { placeId }
}
