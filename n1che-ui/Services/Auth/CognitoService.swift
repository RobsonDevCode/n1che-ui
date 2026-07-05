import Amplify
import AWSCognitoAuthPlugin

final class CognitoService {
    // Length of the verification codes Cognito emails out
    static let codeLength = 6

    func signIn(identifier: String, password: String) async throws -> AuthUser {
        let result = try await Amplify.Auth.signIn(
            username: identifier,
            password: password,
            options: .init(pluginOptions: AWSAuthSignInOptions(authFlowType: .userPassword))
        )
        guard result.isSignedIn else {
            throw CognitoServiceError.signInIncomplete
        }
        guard let user = await currentUser() else {
            throw CognitoServiceError.sessionUnavailable
        }
        return user
    }

    func signUp(email: String, username: String, password: String) async throws {
        _ = try await Amplify.Auth.signUp(
            username: username,
            password: password,
            options: .init(userAttributes: [
                AuthUserAttribute(.email, value: email),
                AuthUserAttribute(.preferredUsername, value: username),
            ])
        )
    }

    func confirmSignUp(username: String, code: String) async throws {
        _ = try await Amplify.Auth.confirmSignUp(for: username, confirmationCode: code)
    }

    func resendCode(username: String) async throws {
        _ = try await Amplify.Auth.resendSignUpCode(for: username)
    }

    func signOut() async {
        _ = await Amplify.Auth.signOut()
    }

    func resetPassword(username: String) async throws {
        _ = try await Amplify.Auth.resetPassword(for: username)
    }

    func confirmResetPassword(username: String, newPassword: String, code: String) async throws {
        try await Amplify.Auth.confirmResetPassword(
            for: username,
            with: newPassword,
            confirmationCode: code
        )
    }

    // Returns nil instead of throwing when no active session exists
    func currentUser() async -> AuthUser? {
        guard let user = try? await Amplify.Auth.getCurrentUser() else { return nil }
        let attributes = (try? await Amplify.Auth.fetchUserAttributes()) ?? []
        let email = attributes.first { $0.key == .email }?.value ?? ""
        let username = attributes.first { $0.key == .preferredUsername }?.value ?? user.username
        return AuthUser(userId: user.userId, username: username, email: email)
    }
}
