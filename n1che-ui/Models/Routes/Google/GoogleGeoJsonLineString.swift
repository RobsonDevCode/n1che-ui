// GeoJSON LineString: coordinates are [longitude, latitude] pairs.
struct GoogleGeoJsonLineString: Decodable {
    let coordinates: [[Double]]?
}
