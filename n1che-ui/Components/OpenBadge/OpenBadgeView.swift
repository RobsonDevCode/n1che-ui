import SwiftUI

struct OpenBadgeView: View {
    private static let dotSize: CGFloat  = 5
    private static let fontSize: CGFloat = 8
    private static let hPadding: CGFloat = 9
    private static let vPadding: CGFloat = 5
    private static let dotSpacing: CGFloat = 5
    private static let labelKerning: CGFloat = 1.5
    private static let timeKerning: CGFloat  = 1.0
    private static let timeOpacity: CGFloat  = 0.75

    let isOpen: Bool
    let closingTime: String

    private var dotColor: Color  { isOpen ? .openGreen : .grey2 }
    private var textColor: Color { isOpen ? .white : .grey2 }

    var body: some View {
        HStack(spacing: Self.dotSpacing) {
            Circle()
                .fill(dotColor)
                .frame(width: Self.dotSize, height: Self.dotSize)
            Text(isOpen ? "OPEN" : "CLOSED")
                .font(.mono(Self.fontSize))
                .kerning(Self.labelKerning)
                .foregroundStyle(textColor)
            Text(closingTime)
                .font(.mono(Self.fontSize))
                .kerning(Self.timeKerning)
                .foregroundStyle(textColor.opacity(Self.timeOpacity))
        }
        .padding(.horizontal, Self.hPadding)
        .padding(.vertical, Self.vPadding)
        .background(Color.inkCol)
    }
}
