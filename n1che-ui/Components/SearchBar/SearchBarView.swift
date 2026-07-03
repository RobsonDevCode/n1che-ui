import SwiftUI

enum SearchBarVariant {
    case `default`, ink
}

struct SearchBarView: View {
    private static let iconSize: CGFloat    = 18
    private static let inputSize: CGFloat   = 13
    private static let clearSize: CGFloat   = 12
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

    var body: some View {
        let isInk = variant == .ink

        HStack(spacing: Self.itemSpacing) {
            if loading {
                ProgressView()
                    .tint(isInk ? Color.paper.opacity(0.5) : .grey)
                    .frame(width: Self.iconSize, height: Self.iconSize)
            } else {
                Text("⌕")
                    .font(.special(Self.iconSize))
                    .foregroundStyle(isInk ? Color.paper.opacity(0.5) : .grey)
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
                    Text("✕")
                        .font(.mono(Self.clearSize))
                        .foregroundStyle(isInk ? Color.paper.opacity(0.5) : .grey)
                }
            }
        }
        .padding(.horizontal, Self.hPadding)
        .padding(.vertical, Self.vPadding)
        .background(isInk ? Color.inkCol : .white)
        .overlay(alignment: .bottom) {
            Rectangle()
                .fill(isInk ? Color.paper.opacity(0.2) : .inkCol)
                .frame(height: Self.borderWidth)
        }
    }
}
