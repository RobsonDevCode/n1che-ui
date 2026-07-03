import SwiftUI

struct HeaderTitleView: View {
    let text: String

    var body: some View {
        Text(text.uppercased())
            .font(.bebas(FontSize.h2))
            .kerning(1.5)
            .foregroundStyle(Color.white)
    }
}
