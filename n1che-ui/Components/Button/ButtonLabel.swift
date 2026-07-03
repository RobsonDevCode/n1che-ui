import SwiftUI

struct ButtonLabel: View {
    let text: String
    let variant: ButtonVariant
    let active: Bool

    var body: some View {
        Text(text.uppercased())
            .font(font)
            .kerning(kerning)
            .foregroundStyle(color)
    }

    private var font: Font {
        switch variant {
        case .outline, .primary, .action, .paper, .cta, .danger, .pill, .pillFlat:
            return .bebas(fontSize)
        case .ghost, .chip, .icon:
            return .mono(fontSize)
        case .link:
            return .special(fontSize)
        }
    }

    private var fontSize: CGFloat {
        switch variant {
        case .primary, .cta:       return 20
        case .action, .paper:      return 16
        case .danger:              return 18
        case .pill, .pillFlat:     return 14
        case .ghost, .chip, .icon: return 10
        case .link:                return FontSize.small
        default:                   return FontSize.h3
        }
    }

    private var kerning: CGFloat {
        switch variant {
        case .primary:                        return 2.4
        case .cta:                            return 2.5
        case .outline, .paper:               return 2.0
        case .action, .danger:               return 1.5
        case .ghost, .chip, .pill, .pillFlat: return 1.5
        default:                              return 0
        }
    }

    private var color: Color {
        if active {
            switch variant {
            case .action, .chip, .pill, .pillFlat: return .white
            default: break
            }
        }
        switch variant {
        case .primary, .danger: return .white
        case .ghost:            return .white.opacity(0.5)
        case .link:             return .ink2
        default:                return .inkCol
        }
    }
}
