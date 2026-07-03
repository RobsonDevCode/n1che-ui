import SwiftUI

struct SubtitleView: View {
    let text: String
    var size: CGFloat = FontSize.label
    var color: Color = .grey

    var body: some View {
        Text(text.uppercased())
            .font(.mono(size))
            .kerning(1.5)
            .foregroundStyle(color)
    }
}
