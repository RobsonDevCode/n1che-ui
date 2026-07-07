struct Place: Codable, Identifiable {
    let id: String
    let displayName: PlaceText?
    let formattedAddress: String?
    let location: PlaceLatLng?
    let photos: [PlacePhoto]?
    let currentOpeningHours: PlaceOpeningHours?
}
