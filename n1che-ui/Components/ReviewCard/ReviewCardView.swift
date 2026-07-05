import SwiftUI

struct ReviewCardView: View {
    let review: Review

    private static let hPadding: CGFloat = 16
    private static let vPadding: CGFloat = 12
    private static let bottomBorderWidth: CGFloat = 1
    private static let contentGap: CGFloat = 6
    private static let metaGap: CGFloat = 8
    private static let userFontSize: CGFloat = 13
    private static let userKerning: CGFloat = 0.5
    private static let dateFontSize: CGFloat = 8
    private static let dateKerning: CGFloat = 1
    private static let bodyFontSize: CGFloat = 12
    private static let bodyLineSpacing: CGFloat = 6

    var body: some View {
        VStack(alignment: .leading, spacing: Self.contentGap) {
            HStack(spacing: Self.metaGap) {
                Text("@\(review.user)")
                    .font(.bebas(Self.userFontSize))
                    .kerning(Self.userKerning)
                    .foregroundStyle(Color.inkCol)
                    .frame(maxWidth: .infinity, alignment: .leading)
                Text(review.date)
                    .font(.mono(Self.dateFontSize))
                    .kerning(Self.dateKerning)
                    .foregroundStyle(Color.grey)
            }
            Text(review.text)
                .font(.special(Self.bodyFontSize))
                .foregroundStyle(Color.ink2)
                .lineSpacing(Self.bodyLineSpacing)
        }
        .padding(.horizontal, Self.hPadding)
        .padding(.vertical, Self.vPadding)
        .bottomBorder(height: Self.bottomBorderWidth)
    }
}
