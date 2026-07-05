import SwiftUI

struct AuthHeaderView: View {
    let title: String
    let height: CGFloat
    let watermarkSize: CGFloat
    let onBack: () -> Void

    private static let backBottomGap: CGFloat = 8
    private static let badgeRowBottomGap: CGFloat = 12
    private static let titleKerning: CGFloat = 2

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                NicheButton("Back", variant: .ghost, leadingIcon: .arrowLeft, action: onBack)
                Spacer()
            }
            .padding(.bottom, Self.backBottomGap)
            IssueBadgeRowView()
                .padding(.bottom, Self.badgeRowBottomGap)
            HeaderTitleView(text: title, size: FontSize.h1, kerning: Self.titleKerning)
            Spacer(minLength: 0)
        }
        .padding(.horizontal, Spacing.lg)
        .padding(.vertical, Spacing.md)
        .frame(maxWidth: .infinity, alignment: .leading)
        .frame(height: height)
        .overlay(alignment: .topTrailing) {
            HeaderWatermarkView(size: watermarkSize)
        }
        .clipped()
    }
}
