import SwiftUI

struct AuthLinkView: View {
    let text: String
    var bold: String? = nil
    var leadingIcon: AppIcon? = nil
    let action: () -> Void

    private static let textSize: CGFloat = FontSize.small
    private static let boldSize: CGFloat = FontSize.caption
    private static let boldKerning: CGFloat = 1.5
    private static let gap: CGFloat = 8
    private static let iconSize: CGFloat = 11
    private static let pressedOpacity: Double = 0.7

    var body: some View {
        Button(action: action) {
            HStack(spacing: Self.gap) {
                if let leadingIcon {
                    IconView(icon: leadingIcon, size: Self.iconSize, color: .ink2)
                }
                Text(text)
                    .font(.special(Self.textSize))
                    .foregroundStyle(Color.ink2)
                if let bold {
                    Text(bold.uppercased())
                        .font(.mono(Self.boldSize))
                        .kerning(Self.boldKerning)
                        .foregroundStyle(Color.inkCol)
                }
            }
            .padding(.vertical, Spacing.sm)
            .frame(maxWidth: .infinity)
        }
        .buttonStyle(PressOpacityStyle(pressedOpacity: Self.pressedOpacity))
    }
}
