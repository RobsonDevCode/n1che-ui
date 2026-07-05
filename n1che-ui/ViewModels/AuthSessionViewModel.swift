import Foundation

@Observable
final class AuthSessionViewModel {
    private let cognito = CognitoService()

    func restoreSession(into store: AuthStore) async {
        if let user = await cognito.currentUser() {
            store.setUser(userId: user.userId, username: user.username, email: user.email)
        } else {
            store.clearUser()
        }
    }

    func signOut(clearing store: AuthStore) async {
        await cognito.signOut()
        store.clearUser()
    }
}
