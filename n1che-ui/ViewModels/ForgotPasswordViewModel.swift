import Foundation

@MainActor
@Observable
final class ForgotPasswordViewModel {
    enum Step {
        case request, confirm
    }

    var step: Step = .request
    var identifier = ""
    var newPassword = ""
    var confirmNewPassword = ""
    var errorMessage = ""
    var isLoading = false
    // Set when the password was reset but the follow-up sign-in failed —
    // the user must log in manually with the new password
    var resetComplete = false
    var code = "" {
        didSet { code = StringUtils.truncated(code, maxLength: CognitoService.codeLength) }
    }

    private let cognito = CognitoService()

    // Also serves as "resend" from the confirm step
    func sendCode() async {
        errorMessage = ""
        code = ""
        let identifier = identifier.trimmingCharacters(in: .whitespaces)
        guard !identifier.isEmpty else {
            errorMessage = "Please enter your email or username."
            return
        }
        isLoading = true
        defer { isLoading = false }
        do {
            try await cognito.resetPassword(username: identifier)
            step = .confirm
        } catch {
            errorMessage = AuthErrorMessage.message(for: error)
        }
    }

    func confirmReset() async -> AuthUser? {
        errorMessage = ""
        guard !code.trimmingCharacters(in: .whitespaces).isEmpty else {
            errorMessage = "Please enter the code."
            return nil
        }
        guard !newPassword.isEmpty, !confirmNewPassword.isEmpty else {
            errorMessage = "Please fill in all fields."
            return nil
        }
        guard newPassword == confirmNewPassword else {
            errorMessage = "Passwords do not match."
            return nil
        }
        isLoading = true
        defer { isLoading = false }
        let identifier = identifier.trimmingCharacters(in: .whitespaces)
        do {
            try await cognito.confirmResetPassword(
                username: identifier,
                newPassword: newPassword,
                code: code
            )
        } catch {
            errorMessage = AuthErrorMessage.message(for: error)
            return nil
        }
        do {
            return try await cognito.signIn(identifier: identifier, password: newPassword)
        } catch {
            resetComplete = true
            return nil
        }
    }

    func backToRequest() {
        step = .request
        code = ""
        newPassword = ""
        confirmNewPassword = ""
        errorMessage = ""
    }
}
