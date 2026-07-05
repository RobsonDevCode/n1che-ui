import SwiftUI

struct SignUpView: View {
    @Environment(AuthStore.self) private var authStore
    @Environment(AppCoordinator.self) private var coordinator
    @State private var viewModel = SignUpViewModel()

    var body: some View {
        AuthLayoutView(
            title: viewModel.step == .register ? "SIGN UP" : "VERIFY",
            onBack: { coordinator.pop() }
        ) {
            @Bindable var viewModel = viewModel

            if viewModel.step == .register {
                InputBoxView(
                    label: "Email",
                    value: $viewModel.email,
                    placeholder: "your@email.com",
                    keyboard: .emailAddress,
                    contentType: .emailAddress
                )
                InputBoxView(
                    label: "Username",
                    value: $viewModel.username,
                    placeholder: "yourhandle",
                    contentType: .username
                )
                NewPasswordSection(
                    password: $viewModel.password,
                    confirmPassword: $viewModel.confirmPassword
                )
                if !viewModel.errorMessage.isEmpty {
                    AuthErrorText(message: viewModel.errorMessage)
                }
                AuthSubmitButton(title: "Create Account", loading: viewModel.isLoading) {
                    Task { await viewModel.submitRegistration() }
                }
                AuthLinkView(text: "Already have an account?", bold: "LOG IN") {
                    coordinator.replaceTop(.logIn)
                }
            } else {
                VerificationCodeSection(destination: viewModel.email, code: $viewModel.code)
                if !viewModel.errorMessage.isEmpty {
                    AuthErrorText(message: viewModel.errorMessage)
                }
                AuthSubmitButton(title: "Verify", loading: viewModel.isLoading) {
                    Task { await verify() }
                }
                AuthLinkView(text: "Didn't receive it?", bold: "RESEND") {
                    Task { await viewModel.resend() }
                }
                AuthLinkView(text: "Back", leadingIcon: .arrowLeft) {
                    viewModel.backToRegister()
                }
            }
        }
    }

    private func verify() async {
        guard let user = await viewModel.verify() else { return }
        authStore.setUser(userId: user.userId, username: user.username, email: user.email)
        coordinator.popToRoot()
    }
}
