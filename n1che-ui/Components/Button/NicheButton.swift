import SwiftUI

struct NicheButton<Content: View>: View {
    private static var primaryRotation: Double { -0.3 }

    var variant: ButtonVariant = .outline
    var active: Bool = false
    var disabled: Bool = false
    var loading: Bool = false
    var rotate: Double? = nil
    var cornerRadius: CGFloat? = nil
    let action: () -> Void
    @ViewBuilder let content: () -> Content

    var body: some View {
        Button(action: action) {
            if loading {
                ProgressView()
                    .tint(indicatorColor)
            } else {
                content()
            }
        }
        .buttonStyle(NicheButtonStyle(variant: variant, active: active, disabled: disabled, cornerRadius: cornerRadius))
        .rotationEffect(.degrees(rotate ?? (variant == .primary ? Self.primaryRotation : 0)))
        .disabled(disabled || loading)
    }

    private var indicatorColor: Color {
        switch variant {
        case .primary, .ghost, .danger: return .white
        case .chip, .pill, .pillFlat:   return active ? .white : .inkCol
        default:                        return .inkCol
        }
    }
}

// Convenience init — auto-styles the text label for the given variant
extension NicheButton where Content == ButtonLabel {
    init(
        _ text: String,
        variant: ButtonVariant = .outline,
        active: Bool = false,
        disabled: Bool = false,
        loading: Bool = false,
        rotate: Double? = nil,
        cornerRadius: CGFloat? = nil,
        leadingIcon: AppIcon? = nil,
        trailingIcon: AppIcon? = nil,
        action: @escaping () -> Void
    ) {
        self.init(variant: variant, active: active, disabled: disabled, loading: loading, rotate: rotate, cornerRadius: cornerRadius, action: action) {
            ButtonLabel(text: text, variant: variant, active: active, leadingIcon: leadingIcon, trailingIcon: trailingIcon)
        }
    }
}

