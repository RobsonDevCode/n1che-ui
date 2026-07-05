import Amplify
import AWSCognitoAuthPlugin

// User-facing copy for auth failures
enum AuthErrorMessage {
    private static let fallback = "Something went wrong."

    static func message(for error: Error) -> String {
        if case CognitoServiceError.signInIncomplete = error {
            return "Please verify your email before logging in."
        }
        guard let authError = error as? AuthError else { return Self.fallback }
        switch authError {
        case .notAuthorized:
            return "Incorrect email or password."
        case .service(_, _, let underlying):
            return serviceMessage(for: underlying)
        default:
            return Self.fallback
        }
    }

    private static func serviceMessage(for underlying: Error?) -> String {
        guard let cognitoError = underlying as? AWSCognitoAuthError else { return Self.fallback }
        switch cognitoError {
        case .userNotFound:
            return "Incorrect email or password."
        case .userNotConfirmed:
            return "Please verify your email before logging in."
        case .usernameExists:
            return "An account with this email already exists."
        case .invalidPassword:
            return "Password must be 8+ chars with uppercase, lowercase, number and symbol."
        case .codeMismatch:
            return "Invalid code. Please try again."
        case .codeExpired:
            return "Code has expired. Request a new one."
        case .limitExceeded, .requestLimitExceeded:
            return "Too many attempts. Try again later."
        case .network:
            return "Network error. Check your connection."
        default:
            return Self.fallback
        }
    }
}
