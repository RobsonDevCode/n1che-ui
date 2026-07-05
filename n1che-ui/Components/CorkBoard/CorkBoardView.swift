import SwiftUI

struct CorkBoardView: View {
    // Positions are fractions of the board size, from the original 390x520 design canvas
    private static let pins: [(lx: CGFloat, ty: CGFloat, rot: Double)] = [
        (0.03, 0.03, -8),
        (0.55, 0.02, 5),
        (0.29, 0.20, -4),
        (0.67, 0.23, 8),
        (0.04, 0.44, -11),
        (0.45, 0.50, 4),
        (0.70, 0.58, -7),
        (0.12, 0.73, 9),
    ]

    private static let tackSize: CGFloat = 12
    private static let tackOverlap: CGFloat = tackSize / 2 + 7
    private static let dotColor = Color.black.opacity(0.07)
    private static let dotRadius: CGFloat = 0.9
    private static let dotSpacing: CGFloat = 5
    // Polaroid (115) plus the tack protruding above it
    private static let itemHeight: CGFloat = 123
    private static let edgeMargin: CGFloat = 6

    let shops: [ShopDisplay]
    // Space at the bottom covered by overlapping UI — pins are laid out above it
    var bottomInset: CGFloat = 0

    var body: some View {
        GeometryReader { geo in
            let boardHeight = max(geo.size.height - bottomInset, Self.itemHeight)
            let itemWidth = PolaroidSize.home.width

            ZStack(alignment: .topLeading) {
                Color.paper2
                HalftonePatternView(
                    dotColor: Self.dotColor,
                    dotRadius: Self.dotRadius,
                    spacing: Self.dotSpacing
                )
                if !shops.isEmpty {
                    ForEach(Array(Self.pins.enumerated()), id: \.offset) { i, pin in
                        VStack(spacing: -Self.tackOverlap) {
                            ThumbtackView(index: i, size: Self.tackSize)
                                .zIndex(1)
                            PolaroidView(shop: shops[i % shops.count], size: .home)
                        }
                        .rotationEffect(.degrees(pin.rot))
                        .offset(
                            x: min(pin.lx * geo.size.width, geo.size.width - itemWidth - Self.edgeMargin),
                            y: min(pin.ty * boardHeight, boardHeight - Self.itemHeight - Self.edgeMargin)
                        )
                    }
                }
            }
            .clipped()
        }
    }
}
