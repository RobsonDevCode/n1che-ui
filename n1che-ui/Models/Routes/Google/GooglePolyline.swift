// Route geometry returned when polylineEncoding is GEO_JSON_LINESTRING.
struct GooglePolyline: Decodable {
    let geoJsonLinestring: GoogleGeoJsonLineString?
}
