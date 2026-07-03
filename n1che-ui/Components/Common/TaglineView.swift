import SwiftUI

struct TaglineView: View {
    let text: String

    var body: some View {
        Text(text)
            .font(.fellItalic(FontSize.body))
            .foregroundStyle(Color.ink2)
            .lineSpacing(4)
    }
}
