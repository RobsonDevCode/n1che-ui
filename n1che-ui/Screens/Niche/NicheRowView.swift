import SwiftUI

struct NicheRowView: View {
    let niche: Niche
    let index: Int
    let isSelected: Bool
    let action: () -> Void

    private static let rowGap: CGFloat = 12
    private static let vPadding: CGFloat = 12
    private static let hPadding: CGFloat = 14
    private static let selectionBarWidth: CGFloat = 4
    private static let badgeSize: CGFloat = 28
    private static let badgeBorderWidth: CGFloat = 2
    private static let badgeFontSize: CGFloat = 15
    private static let nameRowGap: CGFloat = 8
    private static let nameFontSizes: [CGFloat] = [22, 18, 20]
    private static let subKerning: CGFloat = 1.5
    private static let descTopGap: CGFloat = 3
    private static let pressedOpacity: Double = 0.85

    var body: some View {
        Button(action: action) {
            HStack(alignment: .center, spacing: Self.rowGap) {
                badge
                VStack(alignment: .leading, spacing: Self.descTopGap) {
                    HStack(alignment: .firstTextBaseline, spacing: Self.nameRowGap) {
                        Text(niche.label)
                            .font(nameFont)
                            .foregroundStyle(isSelected ? Color.white : .inkCol)
                        Text("(\(niche.sub))".uppercased())
                            .font(.mono(FontSize.label))
                            .kerning(Self.subKerning)
                            .foregroundStyle(isSelected ? Color.white.opacity(0.5) : .grey)
                    }
                    Text(niche.desc)
                        .font(.special(FontSize.caption))
                        .foregroundStyle(isSelected ? Color.white.opacity(0.6) : .grey)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                Text(niche.count.formatted())
                    .font(.oswald(FontSize.small))
                    .foregroundStyle(isSelected ? Color.white.opacity(0.5) : .grey2)
            }
            .padding(.vertical, Self.vPadding)
            .padding(.leading, Self.selectionBarWidth + Self.hPadding)
            .padding(.trailing, Self.hPadding)
            .background(background)
            .overlay(alignment: .leading) {
                if isSelected {
                    Rectangle()
                        .fill(Color.pop)
                        .frame(width: Self.selectionBarWidth)
                }
            }
        }
        .buttonStyle(PressOpacityStyle(pressedOpacity: Self.pressedOpacity))
    }

    private var badge: some View {
        Text(String(format: "%02d", index + 1))
            .font(.bebas(Self.badgeFontSize))
            .foregroundStyle(isSelected ? Color.white : .grey)
            .frame(width: Self.badgeSize, height: Self.badgeSize)
            .background(isSelected ? Color.pop : .paper2)
            .border(isSelected ? Color.pop : .grey2, width: Self.badgeBorderWidth)
    }

    private var nameFont: Font {
        switch index % 3 {
        case 0:  return .bebas(Self.nameFontSizes[0])
        case 1:  return .oswald(Self.nameFontSizes[1])
        default: return .fellItalic(Self.nameFontSizes[2])
        }
    }

    private var background: Color {
        if isSelected { return .inkCol }
        return index % 2 == 0 ? .white : .paper2
    }
}
