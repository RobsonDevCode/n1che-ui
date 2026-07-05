import SwiftUI

struct VerificationCodeSection: View {
    let destination: String
    @Binding var code: String

    private static let headingBottomGap: CGFloat = 8
    private static let subSize: CGFloat = 14
    private static let subLineSpacing: CGFloat = 6
    private static let subBottomGap: CGFloat = 22
    private static let codeFontSize: CGFloat = 24
    private static let codeKerning: CGFloat = 8

    var body: some View {
        Text("Check your email.")
            .font(.fellItalic(FontSize.h2))
            .foregroundStyle(Color.inkCol)
            .padding(.bottom, Self.headingBottomGap)
        Text("We sent a \(CognitoService.codeLength)-digit code to\n\(destination)")
            .font(.special(Self.subSize))
            .foregroundStyle(Color.ink2)
            .lineSpacing(Self.subLineSpacing)
            .padding(.bottom, Self.subBottomGap)
        InputBoxView(
            label: "Verification Code",
            value: $code,
            placeholder: "000000",
            keyboard: .numberPad,
            contentType: .oneTimeCode,
            inputSize: Self.codeFontSize,
            inputKerning: Self.codeKerning,
            isCentered: true
        )
    }
}
