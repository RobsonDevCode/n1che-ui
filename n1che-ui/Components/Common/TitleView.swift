import SwiftUI

struct TitleView: View {
    private static let defaultKerning: CGFloat = 1.5

    let text: String
    var size: CGFloat = FontSize.h3
    var color: Color = .inkCol
    var kerning: CGFloat = defaultKerning

    var body: some View {
        Text(text)
            .font(.bebas(size))
            .kerning(kerning)
            .foregroundStyle(color)
    }
}
