import SwiftUI

struct SearchBarView: View {
    private static let inputSize: CGFloat   = FontSize.small
    private static let hPadding: CGFloat    = 16
    private static let vPadding: CGFloat    = 10
    private static let itemSpacing: CGFloat = 10
    private static let borderWidth: CGFloat = 2

    let placeholder: String
    @Binding var value: String
    var variant: SearchBarVariant = .default
    var loading: Bool = false
    var onSubmit: (String) -> Void = { _ in }
    var onClear: (() -> Void)? = nil

    private static let inkContentOpacity: Double = 0.5
    private static let inkBorderOpacity: Double  = 0.2

    var body: some View {
        let isInk = variant == .ink
        let mutedColor = isInk ? Color.paper.opacity(Self.inkContentOpacity) : .grey

        HStack(spacing: Self.itemSpacing) {
            if loading {
                ProgressView()
                    .tint(mutedColor)
                    .frame(width: IconSize.md, height: IconSize.md)
            } else {
                IconView(icon: .search, size: IconSize.md, color: mutedColor)
            }

            TextField(placeholder, text: $value)
                .font(.special(Self.inputSize))
                .foregroundStyle(isInk ? Color.paper : .inkCol)
                .tint(isInk ? Color.paper : .inkCol)
                .submitLabel(.search)
                .onSubmit { onSubmit(value) }
                .autocorrectionDisabled()
                .textInputAutocapitalization(.never)

            if !value.isEmpty, let onClear {
                Button(action: onClear) {
                    IconView(icon: .close, size: IconSize.sm, color: mutedColor)
                }
            }
        }
        .padding(.horizontal, Self.hPadding)
        .padding(.vertical, Self.vPadding)
        .background(isInk ? Color.inkCol : .white)
        .bottomBorder(
            isInk ? Color.paper.opacity(Self.inkBorderOpacity) : .inkCol,
            height: Self.borderWidth
        )
    }
}
