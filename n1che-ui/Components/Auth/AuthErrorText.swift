import SwiftUI

struct AuthErrorText: View {
    let message: String

    private static let fontSize: CGFloat = FontSize.small

    var body: some View {
        Text(message)
            .font(.special(Self.fontSize))
            .foregroundStyle(Color.errorRed)
            .padding(.bottom, Spacing.sm)
    }
}
