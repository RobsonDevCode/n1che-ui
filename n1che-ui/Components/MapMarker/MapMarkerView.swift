import SwiftUI

struct MapMarkerView: View {
    let shop: ShopDisplay
    let index: Int
    var selected: Bool = false

    private static let tilts: [Double] = [-2.5, 1.5, -1.5, 2.0, -1.0, 1.0, -2.0, 2.5]
    private static let cardBorderWidth: CGFloat = 1.5
    private static let badgeHPadding: CGFloat = 5
    private static let badgeVPadding: CGFloat = 4
    private static let badgeFontSize: CGFloat = 9
    private static let badgeKerning: CGFloat = 0.4
    private static let badgeDividerWidth: CGFloat = 1
    private static let nameFontSize: CGFloat = 10.5
    private static let nameKerning: CGFloat = 0.5
    private static let nameHPadding: CGFloat = 9
    private static let nameVPadding: CGFloat = 4
    private static let stemWidth: CGFloat = 1.5
    private static let stemHeight: CGFloat = 14
    private static let pinSize: CGFloat = 11
    private static let pinBorderWidth: CGFloat = 2
    private static let pinOverlap: CGFloat = 2
    private static let shadowOpacity: Double = 0.35
    private static let shadowRadius: CGFloat = 4
    private static let shadowYOffset: CGFloat = 2

    var body: some View {
        let pin = selected
            ? (face: Color.inkCol, edge: Color.pop)
            : Color.markerPinColors[index % Color.markerPinColors.count]

        VStack(spacing: 0) {
            card
                .rotationEffect(.degrees(Self.tilts[index % Self.tilts.count]))
            Rectangle()
                .fill(Color.inkCol)
                .frame(width: Self.stemWidth, height: Self.stemHeight)
            Circle()
                .fill(pin.face)
                .overlay(Circle().stroke(pin.edge, lineWidth: Self.pinBorderWidth))
                .frame(width: Self.pinSize, height: Self.pinSize)
                .padding(.top, -Self.pinOverlap)
        }
    }

    private var card: some View {
        HStack(spacing: 0) {
            Text(String(format: "%02d", index + 1))
                .font(.mono(Self.badgeFontSize))
                .fontWeight(.bold)
                .kerning(Self.badgeKerning)
                .foregroundStyle(selected ? Color.paper : Color.inkCol)
                .padding(.horizontal, Self.badgeHPadding)
                .padding(.vertical, Self.badgeVPadding)
                .frame(maxHeight: .infinity)
                .background(selected ? Color.inkCol : Color.paper)
            Rectangle()
                .fill(Color.inkCol)
                .frame(width: Self.badgeDividerWidth)
            Text(StringUtils.shortName(shop.name).uppercased())
                .font(.mono(Self.nameFontSize))
                .fontWeight(.semibold)
                .kerning(Self.nameKerning)
                .foregroundStyle(Color.paper)
                .lineLimit(1)
                .padding(.horizontal, Self.nameHPadding)
                .padding(.vertical, Self.nameVPadding)
        }
        .fixedSize()
        .padding(Self.cardBorderWidth)
        .background(Color.inkCol)
        .compositingGroup()
        .shadow(
            color: selected ? Color.inkCol.opacity(Self.shadowOpacity) : .clear,
            radius: Self.shadowRadius,
            x: 0,
            y: Self.shadowYOffset
        )
    }
}
