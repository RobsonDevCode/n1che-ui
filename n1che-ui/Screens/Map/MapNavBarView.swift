import SwiftUI

struct MapNavBarView: View {
    let items: [MapNavBarItem]

    private static let cornerRadius: CGFloat = 26
    private static let hPadding: CGFloat = 16
    private static let topPadding: CGFloat = 14
    private static let bottomPadding: CGFloat = 12
    private static let itemGap: CGFloat = 10
    private static let iconSize: CGFloat = 18
    private static let shadowOpacity: Double = 0.12
    private static let shadowRadius: CGFloat = 20
    private static let shadowYOffset: CGFloat = -10

    var body: some View {
        HStack(spacing: Self.itemGap) {
            ForEach(items) { item in
                NicheButton(variant: .pillFlat, active: item.isActive, action: item.action) {
                    IconView(
                        icon: item.icon,
                        size: Self.iconSize,
                        color: item.isActive ? .white : .inkCol
                    )
                    .frame(maxWidth: .infinity)
                }
            }
        }
        .padding(.horizontal, Self.hPadding)
        .padding(.top, Self.topPadding)
        .padding(.bottom, Self.bottomPadding)
        .background(Color.inkCol)
        .clipShape(UnevenRoundedRectangle(
            topLeadingRadius: Self.cornerRadius,
            topTrailingRadius: Self.cornerRadius
        ))
        .compositingGroup()
        .shadow(
            color: .white.opacity(Self.shadowOpacity),
            radius: Self.shadowRadius,
            x: 0,
            y: Self.shadowYOffset
        )
    }
}
