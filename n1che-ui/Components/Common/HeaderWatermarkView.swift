import SwiftUI

struct HeaderWatermarkView: View {
    let size: CGFloat

    private static let kerning: CGFloat = -2
    private static let opacity: Double = 0.05
    private static let topInset: CGFloat = 10
    private static let trailingInset: CGFloat = 5

    var body: some View {
        Text("NICHE")
            .font(.bebas(size))
            .kerning(Self.kerning)
            .foregroundStyle(Color.white.opacity(Self.opacity))
            .padding(.top, Self.topInset)
            .padding(.trailing, Self.trailingInset)
            .allowsHitTesting(false)
    }
}
