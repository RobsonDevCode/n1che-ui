// Top-level shape of a routes.googleapis.com computeRoutes response.
struct GoogleRoutesResponse: Decodable {
    let routes: [GoogleRoute]?
}
