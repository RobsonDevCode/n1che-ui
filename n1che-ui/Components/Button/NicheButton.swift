import SwiftUI

struct NicheButton<Content: View>: View {
    var variant: ButtonVariant = .outline
    var active: Bool = false
    var disabled: Bool = false
    var loading: Bool = false
    var rotate: Double? = nil
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
        .buttonStyle(NicheButtonStyle(variant: variant, active: active, disabled: disabled))
        .rotationEffect(.degrees(rotate ?? (variant == .primary ? -0.3 : 0)))
        .disabled(disabled || loading)
    }

    private var indicatorColor: Color {
        switch variant {
        case .primary, .ghost, .danger:               return .white
        case .action, .chip, .pill, .pillFlat:        return active ? .white : .inkCol
        default:                                       return .inkCol
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
        action: @escaping () -> Void
    ) {
        self.init(variant: variant, active: active, disabled: disabled, loading: loading, rotate: rotate, action: action) {
            ButtonLabel(text: text, variant: variant, active: active)
        }
    }
}

