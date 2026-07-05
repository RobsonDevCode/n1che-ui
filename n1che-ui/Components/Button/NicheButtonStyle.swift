import SwiftUI

struct NicheButtonStyle: ButtonStyle {
    private static let iconButtonRadius: CGFloat   = 15
    private static let dangerRadius: CGFloat       = 23
    private static let pillRadius: CGFloat         = 20

    private static let ghostHPadding: CGFloat      = 2
    private static let compactHPadding: CGFloat    = 16

    private static let ghostVPadding: CGFloat      = 4
    private static let chipVPadding: CGFloat       = 7
    private static let pillVPadding: CGFloat       = 9
    private static let paperVPadding: CGFloat      = 11
    private static let dangerVPadding: CGFloat     = 13
    private static let primaryVPadding: CGFloat    = 16

    private static let iconButtonSize: CGFloat     = 30

    private static let heavyBorder: CGFloat        = 3
    private static let mediumBorder: CGFloat       = 2
    private static let pillBorder: CGFloat         = 1.5
    private static let thinBorder: CGFloat         = 1
    private static let pillBorderOpacity: Double   = 0.15

    private static let pillShadowOpacityActive: Double = 0.25
    private static let pillShadowOpacity: Double       = 0.18
    private static let pillShadowRadius: CGFloat       = 6
    private static let pillShadowYOffset: CGFloat      = 2
    private static let ctaShadowOpacity: Double        = 0.08
    private static let ctaShadowRadius: CGFloat        = 10
    private static let ctaShadowYOffset: CGFloat       = 4

    private static let pressedOpacity: Double      = 0.85

    let variant: ButtonVariant
    let active: Bool
    let disabled: Bool
    var cornerRadius: CGFloat? = nil

    func makeBody(configuration: Configuration) -> some View {
        let bg: Color = {
            if disabled && variant == .primary { return .grey2 }
            if active {
                switch variant {
                case .chip, .pill, .pillFlat: return .inkCol
                default: break
                }
            }
            switch variant {
            case .outline:  return .paper
            case .primary:  return .pop
            case .ghost:    return .clear
            case .chip:     return .white
            case .paper:    return .paper
            case .icon:     return .white
            case .cta:      return .white
            case .danger:   return .dangerRed
            case .pill:     return .white
            case .pillFlat: return .white
            }
        }()

        let cornerRadius: CGFloat = self.cornerRadius ?? {
            switch variant {
            case .icon:            return Self.iconButtonRadius
            case .cta:             return CornerRadius.soft
            case .danger:          return Self.dangerRadius
            case .pill, .pillFlat: return Self.pillRadius
            default:               return 0
            }
        }()

        configuration.label
            .padding(.horizontal, {
                switch variant {
                case .outline:                         return Spacing.lg
                case .ghost:                           return Self.ghostHPadding
                case .chip, .pill, .pillFlat, .danger: return Self.compactHPadding
                default:                               return 0
                }
            }())
            .padding(.vertical, {
                switch variant {
                case .outline:         return Spacing.sm
                case .ghost:           return Self.ghostVPadding
                case .danger:          return Self.dangerVPadding
                case .chip:            return Self.chipVPadding
                case .paper:           return Self.paperVPadding
                case .pill, .pillFlat: return Self.pillVPadding
                case .primary, .cta:   return Self.primaryVPadding
                default:               return 0
                }
            }())
            .frame(
                width: variant == .icon ? Self.iconButtonSize : nil,
                height: variant == .icon ? Self.iconButtonSize : nil
            )
            .frame(maxWidth: (variant == .primary || variant == .cta || variant == .paper) ? .infinity : nil)
            .background(bg)
            .overlay {
                switch variant {
                case .outline:
                    RoundedRectangle(cornerRadius: cornerRadius).strokeBorder(Color.inkCol, lineWidth: Self.heavyBorder)
                case .chip:
                    RoundedRectangle(cornerRadius: cornerRadius).strokeBorder(Color.inkCol, lineWidth: Self.mediumBorder)
                case .icon:
                    RoundedRectangle(cornerRadius: cornerRadius).strokeBorder(Color.inkCol, lineWidth: Self.thinBorder)
                case .pill:
                    RoundedRectangle(cornerRadius: cornerRadius).strokeBorder(Color.inkCol.opacity(Self.pillBorderOpacity), lineWidth: Self.pillBorder)
                case .pillFlat:
                    RoundedRectangle(cornerRadius: cornerRadius).strokeBorder(Color.inkCol, lineWidth: Self.mediumBorder)
                default:
                    EmptyView()
                }
            }
            .clipShape(RoundedRectangle(cornerRadius: cornerRadius))
            .shadow(
                color: {
                    switch variant {
                    case .pill: return .black.opacity(active ? Self.pillShadowOpacityActive : Self.pillShadowOpacity)
                    case .cta:  return .black.opacity(Self.ctaShadowOpacity)
                    default:    return .clear
                    }
                }(),
                radius: variant == .pill ? Self.pillShadowRadius : variant == .cta ? Self.ctaShadowRadius : 0,
                x: 0,
                y: variant == .pill ? Self.pillShadowYOffset : variant == .cta ? Self.ctaShadowYOffset : 0
            )
            .opacity(configuration.isPressed && !disabled ? Self.pressedOpacity : 1.0)
    }
}
