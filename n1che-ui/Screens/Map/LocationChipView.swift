import SwiftUI

struct LocationChipView: View {
    let label: String

    private static let itemGap: CGFloat = 6
    private static let dotSize: CGFloat = 6
    private static let kerning: CGFloat = 1.5
    private static let hPadding: CGFloat = 10
    private static let vPadding: CGFloat = 4
    private static let borderWidth: CGFloat = 2
    private static let rotationDegrees: Double = -0.5

    var body: some View {
        HStack(spacing: Self.itemGap) {
            Rectangle()
                .fill(Color.pop)
                .frame(width: Self.dotSize, height: Self.dotSize)
            Text(label.isEmpty ? "Locating…" : label)
                .font(.mono(FontSize.label))
                .kerning(Self.kerning)
                .foregroundStyle(Color.inkCol)
        }
        .padding(.horizontal, Self.hPadding)
        .padding(.vertical, Self.vPadding)
        .background(Color.white)
        .border(Color.inkCol, width: Self.borderWidth)
        .rotationEffect(.degrees(Self.rotationDegrees))
    }
}
