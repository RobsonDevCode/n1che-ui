import SwiftUI

struct InputBoxView: View {
    private static let labelSize: CGFloat   = 9
    private static let labelKerning: CGFloat = 1.5
    private static let labelGap: CGFloat    = 4
    private static let inputSize: CGFloat   = 15
    private static let borderWidth: CGFloat = 2
    private static let hPadding: CGFloat    = Spacing.md
    private static let vPadding: CGFloat    = 10

    let label: String
    @Binding var value: String
    var placeholder: String = ""
    var isSecure: Bool = false

    var body: some View {
        VStack(alignment: .leading, spacing: Self.labelGap) {
            Text(label.uppercased())
                .font(.mono(Self.labelSize))
                .kerning(Self.labelKerning)
                .foregroundStyle(Color.inkCol)

            Group {
                if isSecure {
                    SecureField(placeholder, text: $value)
                } else {
                    TextField(placeholder, text: $value)
                }
            }
            .font(.special(Self.inputSize))
            .foregroundStyle(Color.inkCol)
            .tint(Color.inkCol)
            .autocorrectionDisabled()
            .padding(.horizontal, Self.hPadding)
            .padding(.vertical, Self.vPadding)
            .background(Color.white)
            .overlay(
                Rectangle().strokeBorder(Color.inkCol, lineWidth: Self.borderWidth)
            )
        }
        .padding(.bottom, Spacing.md)
    }
}
