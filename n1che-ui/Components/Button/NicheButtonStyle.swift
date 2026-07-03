import SwiftUI

struct NicheButtonStyle: ButtonStyle {
    let variant: ButtonVariant
    let active: Bool
    let disabled: Bool

    func makeBody(configuration: Configuration) -> some View {
        let bg: Color = {
            if disabled && variant == .primary { return .grey2 }
            if active {
                switch variant {
                case .action, .chip, .pill, .pillFlat: return .inkCol
                default: break
                }
            }
            switch variant {
            case .outline:  return .paper
            case .primary:  return .pop
            case .ghost:    return .clear
            case .action:   return .white
            case .link:     return .clear
            case .chip:     return .white
            case .paper:    return .paper
            case .icon:     return .white
            case .cta:      return .paper
            case .danger:   return Color(hex: "#C0392B")
            case .pill:     return .white
            case .pillFlat: return .white
            }
        }()

        let cornerRadius: CGFloat = {
            switch variant {
            case .icon:            return 15
            case .cta:             return 13
            case .danger:          return 23
            case .pill, .pillFlat: return 20
            default:               return 0
            }
        }()

        configuration.label
            .padding(.horizontal, {
                switch variant {
                case .outline:              return Spacing.lg
                case .ghost:                return 2
                case .chip, .pill, .pillFlat, .danger: return 16
                default:                    return 0
                }
            }())
            .padding(.vertical, {
                switch variant {
                case .outline:           return Spacing.sm
                case .ghost:             return 4
                case .action, .danger:   return 13
                case .chip:              return 7
                case .paper:             return 11
                case .pill, .pillFlat:   return 9
                case .link:              return Spacing.sm
                case .primary:           return 16
                case .cta:               return 18
                default:                 return 0
                }
            }())
            .frame(width: variant == .icon ? 30 : nil, height: variant == .icon ? 30 : nil)
            .frame(maxWidth: (variant == .primary || variant == .cta || variant == .paper) ? .infinity : nil)
            .background(bg)
            .overlay {
                switch variant {
                case .outline, .action:
                    RoundedRectangle(cornerRadius: cornerRadius).strokeBorder(Color.inkCol, lineWidth: 3)
                case .chip:
                    RoundedRectangle(cornerRadius: cornerRadius).strokeBorder(Color.inkCol, lineWidth: 2)
                case .icon:
                    RoundedRectangle(cornerRadius: cornerRadius).strokeBorder(Color.inkCol, lineWidth: 1)
                case .pill:
                    RoundedRectangle(cornerRadius: cornerRadius).strokeBorder(Color.inkCol.opacity(0.15), lineWidth: 1.5)
                case .pillFlat:
                    RoundedRectangle(cornerRadius: cornerRadius).strokeBorder(Color.inkCol, lineWidth: 2)
                default:
                    EmptyView()
                }
            }
            .clipShape(RoundedRectangle(cornerRadius: cornerRadius))
            .shadow(
                color: variant == .pill ? .black.opacity(active ? 0.25 : 0.18) : .clear,
                radius: variant == .pill ? 6 : 0,
                x: 0, y: variant == .pill ? 2 : 0
            )
            .opacity(configuration.isPressed && !disabled ? 0.85 : 1.0)
    }
}
