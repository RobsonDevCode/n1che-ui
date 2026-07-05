import SwiftUI

struct LoginView: View {
    @Environment(AuthStore.self) private var authStore
    @Environment(AppCoordinator.self) private var coordinator
    @State private var viewModel = LoginViewModel()

    var body: some View {
        AuthLayoutView(title: "LOG IN", onBack: { coordinator.pop() }) {
            @Bindable var viewModel = viewModel

            AuthIdentifierField(value: $viewModel.identifier)
            AuthPasswordField(label: "Password", value: $viewModel.password)
            if !viewModel.errorMessage.isEmpty {
                AuthErrorText(message: viewModel.errorMessage)
            }
            AuthSubmitButton(title: "Log In", loading: viewModel.isLoading) {
                Task { await submit() }
            }
            AuthLinkView(text: "Don't have an account?", bold: "SIGN UP") {
                coordinator.replaceTop(.signUp)
            }
            AuthLinkView(text: "Forgot your password?", bold: "RESET") {
                coordinator.push(.forgotPassword)
            }
        }
    }

    private func submit() async {
        guard let user = await viewModel.logIn() else { return }
        authStore.setUser(userId: user.userId, username: user.username, email: user.email)
        coordinator.popToRoot()
    }
}
