import SwiftUI

struct TitleView: View {
    let text: String
    var size: CGFloat = FontSize.h3
    var color: Color = .inkCol

    var body: some View {
        Text(text)
            .font(.bebas(size))
            .kerning(1.5)
            .foregroundStyle(color)
    }
}
