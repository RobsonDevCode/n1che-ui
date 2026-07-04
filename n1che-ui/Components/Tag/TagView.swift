import SwiftUI

struct TagView: View {
    let label: String

    private static let borderWidth: CGFloat = 1
    private static let kerning: CGFloat = 1.5

    var body: some View {
        Text(label.uppercased())
            .font(.mono(FontSize.label))
            .kerning(Self.kerning)
            .foregroundStyle(Color.inkCol)
            .padding(.horizontal, Spacing.sm)
            .padding(.vertical, Spacing.xs)
            .border(Color.inkCol, width: Self.borderWidth)
    }
}
