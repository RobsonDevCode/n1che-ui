import Foundation

// RFC 9457 Problem Details — the shared failure shape for every API call, so
// callers handle and present failures uniformly. Constructed locally for
// client-side failures and decodable from a server that speaks the same format.
struct ProblemDetails: Error, Decodable {
    let type: String
    let title: String
    let status: Int
    let detail: String?
    let instance: String?

    init(
        type: String = "about:blank",
        title: String,
        status: Int,
        detail: String? = nil,
        instance: String? = nil
    ) {
        self.type = type
        self.title = title
        self.status = status
        self.detail = detail
        self.instance = instance
    }
}

extension ProblemDetails: LocalizedError {
    var errorDescription: String? { detail ?? title }
}

// Client-side failures shared across services.
extension ProblemDetails {
    static let missingAPIKey = ProblemDetails(title: "Missing API key.", status: 401)
    static let invalidRequest = ProblemDetails(title: "Invalid request.", status: 400)
    static let noResults = ProblemDetails(title: "No results found.", status: 404)
    static let invalidResponse = ProblemDetails(title: "Unexpected response from the server.", status: 502)

    static func requestFailed(status: Int) -> ProblemDetails {
        ProblemDetails(title: "Request failed.", status: status)
    }
}
