import SwiftUI

struct SignUpView: View {
    @Environment(AuthStore.self) private var authStore
    @Environment(AppCoordinator.self) private var coordinator
    @State private var viewModel = SignUpViewModel()

    private static let confirmHeadingSize: CGFloat = 28
    private static let confirmHeadingBottomGap: CGFloat = 8
    private static let confirmSubSize: CGFloat = 14
    private static let confirmSubLineSpacing: CGFloat = 6
    private static let confirmSubBottomGap: CGFloat = 22
    private static let codeFontSize: CGFloat = 24
    private static let codeKerning: CGFloat = 8

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
                InputBoxView(
                    label: "Password",
                    value: $viewModel.password,
                    placeholder: "••••••••",
                    isSecure: true,
                    contentType: .newPassword
                )
                PasswordRequirementsView(password: viewModel.password)
                InputBoxView(
                    label: "Confirm Password",
                    value: $viewModel.confirmPassword,
                    placeholder: "••••••••",
                    isSecure: true,
                    contentType: .newPassword
                )
                if !viewModel.errorMessage.isEmpty {
                    AuthErrorText(message: viewModel.errorMessage)
                }
                NicheButton("Create Account", variant: .primary, loading: viewModel.isLoading, cornerRadius: CornerRadius.soft, trailingIcon: .arrowRight) {
                    Task { await viewModel.submitRegistration() }
                }
                AuthLinkView(text: "Already have an account?", bold: "LOG IN") {
                    coordinator.replaceTop(.logIn)
                }
            } else {
                Text("Check your email.")
                    .font(.fellItalic(Self.confirmHeadingSize))
                    .foregroundStyle(Color.inkCol)
                    .padding(.bottom, Self.confirmHeadingBottomGap)
                Text("We sent a \(SignUpViewModel.codeLength)-digit code to\n\(viewModel.email)")
                    .font(.special(Self.confirmSubSize))
                    .foregroundStyle(Color.ink2)
                    .lineSpacing(Self.confirmSubLineSpacing)
                    .padding(.bottom, Self.confirmSubBottomGap)
                InputBoxView(
                    label: "Verification Code",
                    value: $viewModel.code,
                    placeholder: "000000",
                    keyboard: .numberPad,
                    contentType: .oneTimeCode,
                    inputSize: Self.codeFontSize,
                    inputKerning: Self.codeKerning,
                    isCentered: true
                )
                if !viewModel.errorMessage.isEmpty {
                    AuthErrorText(message: viewModel.errorMessage)
                }
                NicheButton("Verify", variant: .primary, loading: viewModel.isLoading, cornerRadius: CornerRadius.soft, trailingIcon: .arrowRight) {
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
