import SwiftUI

struct TooltipView: View {
    enum Position {
        case top
        case bottom
    }

    let text: String
    var position: Position = .bottom

    private static let hPadding: CGFloat = 16
    private static let vPadding: CGFloat = 6
    private static let caretSize: CGFloat = 8
    private static let caretLeadingInset: CGFloat = 20
    // Rounded bubble is a deliberate design exception to the zero-radius rule
    private static let bubbleCornerRadius: CGFloat = 10
    private static let bubbleHPadding: CGFloat = 14
    private static let bubbleVPadding: CGFloat = 10
    private static let bubbleGap: CGFloat = 8
    private static let iconFontSize: CGFloat = 14
    private static let iconOpacity: Double = 0.5
    private static let textFontSize: CGFloat = 12
    private static let textLineSpacing: CGFloat = 5

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            if position == .bottom {
                caret(pointsUp: true)
            }
            HStack(alignment: .top, spacing: Self.bubbleGap) {
                IconView(
                    icon: .info,
                    size: Self.iconFontSize,
                    color: .paper.opacity(Self.iconOpacity)
                )
                Text(text)
                    .font(.special(Self.textFontSize))
                    .foregroundStyle(Color.paper)
                    .lineSpacing(Self.textLineSpacing)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
            .padding(.horizontal, Self.bubbleHPadding)
            .padding(.vertical, Self.bubbleVPadding)
            .background(Color.inkCol)
            .clipShape(RoundedRectangle(cornerRadius: Self.bubbleCornerRadius))
            if position == .top {
                caret(pointsUp: false)
            }
        }
        .padding(.horizontal, Self.hPadding)
        .padding(.vertical, Self.vPadding)
    }

    private func caret(pointsUp: Bool) -> some View {
        Caret(pointsUp: pointsUp)
            .fill(Color.inkCol)
            .frame(width: Self.caretSize * 2, height: Self.caretSize)
            .padding(.leading, Self.caretLeadingInset)
    }

    private struct Caret: Shape {
        let pointsUp: Bool

        func path(in rect: CGRect) -> Path {
            var path = Path()
            if pointsUp {
                path.move(to: CGPoint(x: rect.midX, y: rect.minY))
                path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
                path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))
            } else {
                path.move(to: CGPoint(x: rect.minX, y: rect.minY))
                path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
                path.addLine(to: CGPoint(x: rect.midX, y: rect.maxY))
            }
            path.closeSubpath()
            return path
        }
    }
}
