import SwiftUI

struct TitleView: View {
    private static let kerning: CGFloat = 1.5

    let text: String
    var size: CGFloat = FontSize.h3
    var color: Color = .inkCol

    var body: some View {
        Text(text)
            .font(.bebas(size))
            .kerning(Self.kerning)
            .foregroundStyle(color)
    }
}
