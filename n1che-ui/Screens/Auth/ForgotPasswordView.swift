import SwiftUI

struct ForgotPasswordView: View {
    @Environment(AuthStore.self) private var authStore
    @Environment(AppCoordinator.self) private var coordinator
    @State private var viewModel = ForgotPasswordViewModel()

    private static let introSize: CGFloat = 14
    private static let introLineSpacing: CGFloat = 6
    private static let introBottomGap: CGFloat = 22

    var body: some View {
        AuthLayoutView(
            title: viewModel.step == .request ? "RESET" : "VERIFY",
            onBack: { coordinator.pop() }
        ) {
            @Bindable var viewModel = viewModel

            if viewModel.step == .request {
                Text("Enter your email or username and we'll send you a reset code.")
                    .font(.special(Self.introSize))
                    .foregroundStyle(Color.ink2)
                    .lineSpacing(Self.introLineSpacing)
                    .padding(.bottom, Self.introBottomGap)
                AuthIdentifierField(value: $viewModel.identifier)
                if !viewModel.errorMessage.isEmpty {
                    AuthErrorText(message: viewModel.errorMessage)
                }
                AuthSubmitButton(title: "Send Code", loading: viewModel.isLoading) {
                    Task { await viewModel.sendCode() }
                }
            } else {
                VerificationCodeSection(destination: viewModel.identifier, code: $viewModel.code)
                NewPasswordSection(
                    password: $viewModel.newPassword,
                    confirmPassword: $viewModel.confirmNewPassword,
                    label: "New Password",
                    confirmLabel: "Confirm New Password"
                )
                if !viewModel.errorMessage.isEmpty {
                    AuthErrorText(message: viewModel.errorMessage)
                }
                AuthSubmitButton(title: "Reset Password", loading: viewModel.isLoading) {
                    Task { await submit() }
                }
                AuthLinkView(text: "Didn't receive it?", bold: "RESEND") {
                    Task { await viewModel.sendCode() }
                }
                AuthLinkView(text: "Back", leadingIcon: .arrowLeft) {
                    viewModel.backToRequest()
                }
            }
        }
    }

    private func submit() async {
        if let user = await viewModel.confirmReset() {
            authStore.setUser(userId: user.userId, username: user.username, email: user.email)
            coordinator.popToRoot()
        } else if viewModel.resetComplete {
            coordinator.replaceTop(.logIn)
        }
    }
}
