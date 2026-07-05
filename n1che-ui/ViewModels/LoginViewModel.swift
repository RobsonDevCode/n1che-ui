import Foundation

@MainActor
@Observable
final class LoginViewModel {
    var identifier = ""
    var password = ""
    var errorMessage = ""
    var isLoading = false

    private let cognito = CognitoService()

    func logIn() async -> AuthUser? {
        errorMessage = ""
        let identifier = identifier.trimmingCharacters(in: .whitespaces)
        guard !identifier.isEmpty, !password.isEmpty else {
            errorMessage = "Please fill in all fields."
            return nil
        }
        isLoading = true
        defer { isLoading = false }
        do {
            return try await cognito.signIn(identifier: identifier, password: password)
        } catch {
            errorMessage = AuthErrorMessage.message(for: error)
            return nil
        }
    }
}
