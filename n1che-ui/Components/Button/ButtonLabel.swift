import SwiftUI

struct ButtonLabel: View {
    let text: String
    let variant: ButtonVariant
    let active: Bool
    var leadingIcon: AppIcon? = nil
    var trailingIcon: AppIcon? = nil

    private static let iconGap: CGFloat = 6
    private static let iconSizeRatio: CGFloat = 0.75

    private static let primaryFontSize: CGFloat = 20
    private static let dangerFontSize: CGFloat  = 18
    private static let paperFontSize: CGFloat   = 16
    private static let pillFontSize: CGFloat    = 14
    private static let compactFontSize: CGFloat = 10

    private static let ctaKerning: CGFloat     = 2.5
    private static let primaryKerning: CGFloat = 2.4
    private static let wideKerning: CGFloat    = 2.0
    private static let narrowKerning: CGFloat  = 1.5

    private static let ghostTextOpacity: Double = 0.5

    var body: some View {
        HStack(spacing: Self.iconGap) {
            if let leadingIcon {
                IconView(icon: leadingIcon, size: fontSize * Self.iconSizeRatio, color: color)
            }
            Text(text.uppercased())
                .font(font)
                .kerning(kerning)
                .foregroundStyle(color)
            if let trailingIcon {
                IconView(icon: trailingIcon, size: fontSize * Self.iconSizeRatio, color: color)
            }
        }
    }

    private var font: Font {
        switch variant {
        case .outline, .primary, .paper, .cta, .danger, .pill, .pillFlat:
            return .bebas(fontSize)
        case .ghost, .chip, .icon:
            return .mono(fontSize)
        }
    }

    private var fontSize: CGFloat {
        switch variant {
        case .primary, .cta:       return Self.primaryFontSize
        case .paper:               return Self.paperFontSize
        case .danger:              return Self.dangerFontSize
        case .pill, .pillFlat:     return Self.pillFontSize
        case .ghost, .chip, .icon: return Self.compactFontSize
        default:                   return FontSize.h3
        }
    }

    private var kerning: CGFloat {
        switch variant {
        case .primary:                        return Self.primaryKerning
        case .cta:                            return Self.ctaKerning
        case .outline, .paper:                return Self.wideKerning
        case .danger:                         return Self.narrowKerning
        case .ghost, .chip, .pill, .pillFlat: return Self.narrowKerning
        default:                              return 0
        }
    }

    private var color: Color {
        if active {
            switch variant {
            case .chip, .pill, .pillFlat: return .white
            default: break
            }
        }
        switch variant {
        case .primary, .danger: return .white
        case .ghost:            return .white.opacity(Self.ghostTextOpacity)
        default:                return .inkCol
        }
    }
}
