import SwiftUI

struct ShopCardView: View {
    let shop: ShopDisplay
    let index: Int
    let onTap: () -> Void

    private static let rowGap: CGFloat = 12
    private static let hPadding: CGFloat = 16
    private static let vPadding: CGFloat = 11
    private static let bottomBorderWidth: CGFloat = 1
    private static let rankSize: CGFloat = 24
    private static let rankBorderWidth: CGFloat = 2
    private static let rankFontSize: CGFloat = 13
    private static let nameFontSize: CGFloat = 16
    private static let addressTopGap: CGFloat = 2
    private static let voteFontSize: CGFloat = 15
    private static let rightGap: CGFloat = 3
    private static let openRowGap: CGFloat = 3
    private static let dotSize: CGFloat = 5
    private static let openLabelFontSize: CGFloat = 8

    var body: some View {
        let isFirst = index == 0

        Button(action: onTap) {
            HStack(spacing: Self.rowGap) {
                TitleView(
                    text: String(format: "%02d", index + 1),
                    size: Self.rankFontSize,
                    color: isFirst ? .white : .grey
                )
                .frame(width: Self.rankSize, height: Self.rankSize)
                .background(isFirst ? Color.pop : .clear)
                .border(isFirst ? Color.pop : Color.grey2, width: Self.rankBorderWidth)

                VStack(alignment: .leading, spacing: Self.addressTopGap) {
                    Text(shop.name)
                        .font(index % 2 == 0 ? .oswald(Self.nameFontSize) : .fellItalic(Self.nameFontSize))
                        .fontWeight(index % 2 == 0 ? .bold : .regular)
                        .foregroundStyle(Color.inkCol)
                        .lineLimit(1)
                    Text(addressLine)
                        .font(.special(FontSize.caption))
                        .foregroundStyle(Color.grey)
                        .lineLimit(1)
                }
                .frame(maxWidth: .infinity, alignment: .leading)

                VStack(alignment: .trailing, spacing: Self.rightGap) {
                    TitleView(text: "↑\(shop.voteCount)", size: Self.voteFontSize, color: .pop)
                    HStack(spacing: Self.openRowGap) {
                        Rectangle()
                            .fill(shop.isOpen ? Color.inkCol : Color.grey2)
                            .frame(width: Self.dotSize, height: Self.dotSize)
                        SubtitleView(
                            text: shop.isOpen ? "OPEN" : "CLOSED",
                            size: Self.openLabelFontSize,
                            color: shop.isOpen ? .inkCol : .grey2
                        )
                    }
                }
            }
            .padding(.horizontal, Self.hPadding)
            .padding(.vertical, Self.vPadding)
            .background(index % 2 == 0 ? Color.white : Color.paper)
            .overlay(alignment: .bottom) {
                Rectangle()
                    .fill(Color.grey2)
                    .frame(height: Self.bottomBorderWidth)
            }
        }
        .buttonStyle(.plain)
    }

    private var addressLine: String {
        guard let distance = shop.distanceMi else { return shop.address }
        return "\(shop.address) · \(StringUtils.formatMiles(distance))"
    }
}
