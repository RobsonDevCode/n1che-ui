import SwiftUI

struct TaglineView: View {
    let text: String
    var size: CGFloat = FontSize.body
    var color: Color = .ink2

    var body: some View {
        Text(text)
            .font(.fellItalic(size))
            .foregroundStyle(color)
            .lineSpacing(4)
    }
}
