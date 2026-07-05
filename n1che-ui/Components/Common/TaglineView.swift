import SwiftUI

struct TaglineView: View {
    private static let lineSpacing: CGFloat = 4

    let text: String
    var size: CGFloat = FontSize.body
    var color: Color = .ink2

    var body: some View {
        Text(text)
            .font(.fellItalic(size))
            .foregroundStyle(color)
            .lineSpacing(Self.lineSpacing)
    }
}
