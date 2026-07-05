import SwiftUI

struct LoginView: View {
    @Environment(AuthStore.self) private var authStore
    @Environment(AppCoordinator.self) private var coordinator
    @State private var viewModel = LoginViewModel()

    var body: some View {
        AuthLayoutView(title: "LOG IN", onBack: { coordinator.pop() }) {
            @Bindable var viewModel = viewModel

            InputBoxView(
                label: "Email or Username",
                value: $viewModel.identifier,
                placeholder: "your@email.com or yourhandle",
                keyboard: .emailAddress,
                contentType: .username
            )
            InputBoxView(
                label: "Password",
                value: $viewModel.password,
                placeholder: "••••••••",
                isSecure: true,
                contentType: .password
            )
            if !viewModel.errorMessage.isEmpty {
                AuthErrorText(message: viewModel.errorMessage)
            }
            NicheButton("Log In", variant: .primary, loading: viewModel.isLoading, cornerRadius: CornerRadius.soft, trailingIcon: .arrowRight) {
                Task { await submit() }
            }
            AuthLinkView(text: "Don't have an account?", bold: "SIGN UP") {
                coordinator.replaceTop(.signUp)
            }
        }
    }

    private func submit() async {
        guard let user = await viewModel.logIn() else { return }
        authStore.setUser(userId: user.userId, username: user.username, email: user.email)
        coordinator.popToRoot()
    }
}
