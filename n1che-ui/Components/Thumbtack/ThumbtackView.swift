import SwiftUI

struct ThumbtackView: View {
    let index: Int
    var selected: Bool = false
    var size: CGFloat = ThumbtackView.defaultSize

    private static let defaultSize: CGFloat = 14
    private static let lightenAmount = 55
    private static let darkenAmount = 25
    private static let borderDarkenAmount = 35
    private static let borderWidth: CGFloat = 1
    private static let highlightStop: CGFloat = 0.55
    private static let gradientStart = UnitPoint(x: 0.36, y: 0.3)
    private static let gradientEnd = UnitPoint(x: 0.85, y: 0.9)
    private static let shadowOpacity: Double = 0.45
    private static let shadowRadius: CGFloat = 4
    private static let shadowYOffset: CGFloat = 2
    private static let shaftWidth: CGFloat = 2
    private static let shaftHeight: CGFloat = 9

    var body: some View {
        let pinHex = selected ? Palette.popHex : Palette.pinHexValues[index % Palette.pinCount]
        VStack(spacing: 0) {
            Circle()
                .fill(
                    LinearGradient(
                        stops: [
                            .init(color: Color(hex: ColorAdjust.lighten(pinHex, by: Self.lightenAmount)), location: 0),
                            .init(color: Color(hex: pinHex), location: Self.highlightStop),
                            .init(color: Color(hex: ColorAdjust.darken(pinHex, by: Self.darkenAmount)), location: 1),
                        ],
                        startPoint: Self.gradientStart,
                        endPoint: Self.gradientEnd
                    )
                )
                .overlay(
                    Circle().stroke(
                        Color(hex: ColorAdjust.darken(pinHex, by: Self.borderDarkenAmount)),
                        lineWidth: Self.borderWidth
                    )
                )
                .frame(width: size, height: size)
                .shadow(
                    color: .black.opacity(Self.shadowOpacity),
                    radius: Self.shadowRadius,
                    x: 0,
                    y: Self.shadowYOffset
                )
            Rectangle()
                .fill(Color.tackShaft)
                .frame(width: Self.shaftWidth, height: Self.shaftHeight)
        }
        .allowsHitTesting(false)
    }
}
