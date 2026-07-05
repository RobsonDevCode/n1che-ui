import SwiftUI

struct SubtitleView: View {
    private static let kerning: CGFloat = 1.5

    let text: String
    var size: CGFloat = FontSize.label
    var color: Color = .grey

    var body: some View {
        Text(text.uppercased())
            .font(.mono(size))
            .kerning(Self.kerning)
            .foregroundStyle(color)
    }
}
