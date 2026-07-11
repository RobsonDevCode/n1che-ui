import Foundation

// Shared transport for Google's HTTP APIs. Holds the API key and attaches the
// common headers once, then decodes the response into the requested type.
// Failures surface as ProblemDetails so every call site handles them uniformly.
final class GoogleAPIClient {
    static let shared = GoogleAPIClient()

    private let apiKey: String
    private let session: URLSession

    init(apiKey: String = AppConfig.googleAPIKey, session: URLSession = .shared) {
        self.apiKey = apiKey
        self.session = session
    }

    func post<Response: Decodable>(
        _ url: URL,
        fieldMask: String,
        body: [String: Any]
    ) async throws -> Response {
        guard !apiKey.isEmpty else { throw ProblemDetails.missingAPIKey }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(apiKey, forHTTPHeaderField: "X-Goog-Api-Key")
        request.setValue(fieldMask, forHTTPHeaderField: "X-Goog-FieldMask")
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await session.data(for: request)
        if let http = response as? HTTPURLResponse, !(200..<300).contains(http.statusCode) {
            throw ProblemDetails.requestFailed(status: http.statusCode)
        }
        do {
            return try JSONDecoder().decode(Response.self, from: data)
        } catch {
            throw ProblemDetails.invalidResponse
        }
    }
}
