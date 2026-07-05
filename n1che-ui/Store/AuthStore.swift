import Foundation

@MainActor
@Observable
final class AuthStore {
    var isLoading: Bool = true
    var isAuthenticated: Bool = false
    var userId: String? = nil
    var username: String? = nil
    var email: String? = nil

    func setUser(userId: String, username: String, email: String) {
        self.userId = userId
        self.username = username
        self.email = email
        self.isAuthenticated = true
        self.isLoading = false
    }

    func clearUser() {
        self.userId = nil
        self.username = nil
        self.email = nil
        self.isAuthenticated = false
        self.isLoading = false
    }
}
