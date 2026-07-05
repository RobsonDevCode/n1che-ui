import SwiftUI

struct InputBoxView: View {
    private static let labelSize: CGFloat   = FontSize.label
    private static let labelKerning: CGFloat = 1.5
    private static let labelGap: CGFloat    = 4
    private static let defaultInputSize: CGFloat = 15
    private static let hPadding: CGFloat    = Spacing.md
    private static let vPadding: CGFloat    = 12
    private static let shadowOpacity: Double = 0.08
    private static let shadowRadius: CGFloat = 10
    private static let shadowYOffset: CGFloat = 4

    let label: String
    @Binding var value: String
    var placeholder: String = ""
    var isSecure: Bool = false
    var keyboard: UIKeyboardType = .default
    var contentType: UITextContentType? = nil
    var inputSize: CGFloat? = nil
    var inputKerning: CGFloat = 0
    var isCentered: Bool = false

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
            .font(.special(inputSize ?? Self.defaultInputSize))
            .kerning(inputKerning)
            .multilineTextAlignment(isCentered ? .center : .leading)
            .keyboardType(keyboard)
            .textContentType(contentType)
            .textInputAutocapitalization(.never)
            .foregroundStyle(Color.inkCol)
            .tint(Color.inkCol)
            .autocorrectionDisabled()
            .padding(.horizontal, Self.hPadding)
            .padding(.vertical, Self.vPadding)
            .background(Color.white)
            .clipShape(RoundedRectangle(cornerRadius: CornerRadius.soft))
            .shadow(
                color: .black.opacity(Self.shadowOpacity),
                radius: Self.shadowRadius,
                x: 0,
                y: Self.shadowYOffset
            )
        }
        .padding(.bottom, Spacing.md)
    }
}
