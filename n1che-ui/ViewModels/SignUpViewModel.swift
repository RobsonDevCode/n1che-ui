import Foundation

@MainActor
@Observable
final class SignUpViewModel {
    enum Step {
        case register, confirm
    }

    private static let minUsernameLength = 3

    var step: Step = .register
    var email = ""
    var username = ""
    var password = ""
    var confirmPassword = ""
    var errorMessage = ""
    var isLoading = false
    var code = "" {
        didSet { code = StringUtils.truncated(code, maxLength: CognitoService.codeLength) }
    }

    private let cognito = CognitoService()

    func submitRegistration() async {
        errorMessage = ""
        email = email.trimmingCharacters(in: .whitespaces)
        username = username.trimmingCharacters(in: .whitespaces)
        guard !email.isEmpty, !username.isEmpty, !password.isEmpty, !confirmPassword.isEmpty else {
            errorMessage = "Please fill in all fields."
            return
        }
        guard username.count >= Self.minUsernameLength else {
            errorMessage = "Username must be at least \(Self.minUsernameLength) characters."
            return
        }
        guard !username.contains(where: \.isWhitespace) else {
            errorMessage = "Username cannot contain spaces."
            return
        }
        guard !StringUtils.isEmailAddress(username) else {
            errorMessage = "Username cannot be an email address."
            return
        }
        guard password == confirmPassword else {
            errorMessage = "Passwords do not match."
            return
        }
        isLoading = true
        defer { isLoading = false }
        do {
            try await cognito.signUp(email: email, username: username, password: password)
            step = .confirm
        } catch {
            errorMessage = AuthErrorMessage.message(for: error)
        }
    }

    func verify() async -> AuthUser? {
        errorMessage = ""
        guard !code.trimmingCharacters(in: .whitespaces).isEmpty else {
            errorMessage = "Please enter the code."
            return nil
        }
        isLoading = true
        defer { isLoading = false }
        do {
            try await cognito.confirmSignUp(username: username, code: code)
            return try await cognito.signIn(identifier: username, password: password)
        } catch {
            errorMessage = AuthErrorMessage.message(for: error)
            return nil
        }
    }

    func resend() async {
        errorMessage = ""
        isLoading = true
        defer { isLoading = false }
        do {
            try await cognito.resendCode(username: username)
            code = ""
        } catch {
            errorMessage = AuthErrorMessage.message(for: error)
        }
    }

    func backToRegister() {
        step = .register
        code = ""
        errorMessage = ""
    }
}
