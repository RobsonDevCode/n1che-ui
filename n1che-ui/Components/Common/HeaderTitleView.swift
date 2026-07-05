import SwiftUI

struct HeaderTitleView: View {
    let text: String
    var size: CGFloat = FontSize.h2
    var kerning: CGFloat = 1.5

    var body: some View {
        Text(text.uppercased())
            .font(.bebas(size))
            .kerning(kerning)
            .foregroundStyle(Color.white)
    }
}
