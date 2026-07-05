import SwiftUI

struct AuthHeaderView: View {
    let title: String
    let height: CGFloat
    let watermarkSize: CGFloat
    let onBack: () -> Void

    private static let watermarkKerning: CGFloat = -2
    private static let watermarkOpacity: Double = 0.05
    private static let watermarkTopInset: CGFloat = 10
    private static let watermarkTrailingInset: CGFloat = 5
    private static let backBottomGap: CGFloat = 8
    private static let badgeRowGap: CGFloat = 10
    private static let badgeRowBottomGap: CGFloat = 12
    private static let issueHPadding: CGFloat = 8
    private static let issueVPadding: CGFloat = 3
    private static let issueRotation: Double = -1
    private static let issueFontSize: CGFloat = 9
    private static let issueKerning: CGFloat = 1.5
    private static let dateFontSize: CGFloat = 9
    private static let dateKerning: CGFloat = 1.2
    private static let dateOpacity: Double = 0.4
    private static let titleFontSize: CGFloat = 46
    private static let titleKerning: CGFloat = 2

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                NicheButton("Back", variant: .ghost, leadingIcon: .arrowLeft, action: onBack)
                Spacer()
            }
            .padding(.bottom, Self.backBottomGap)
            HStack(spacing: Self.badgeRowGap) {
                Text("ISSUE №01")
                    .font(.mono(Self.issueFontSize))
                    .kerning(Self.issueKerning)
                    .foregroundStyle(Color.white)
                    .padding(.horizontal, Self.issueHPadding)
                    .padding(.vertical, Self.issueVPadding)
                    .background(Color.pop)
                    .rotationEffect(.degrees(Self.issueRotation))
                Text("\(String(Calendar.current.component(.year, from: .now))) · LONDON")
                    .font(.mono(Self.dateFontSize))
                    .kerning(Self.dateKerning)
                    .foregroundStyle(Color.white.opacity(Self.dateOpacity))
            }
            .padding(.bottom, Self.badgeRowBottomGap)
            HeaderTitleView(text: title, size: Self.titleFontSize, kerning: Self.titleKerning)
            Spacer(minLength: 0)
        }
        .padding(.horizontal, Spacing.lg)
        .padding(.vertical, Spacing.md)
        .frame(maxWidth: .infinity, alignment: .leading)
        .frame(height: height)
        .overlay(alignment: .topTrailing) {
            Text("NICHE")
                .font(.bebas(watermarkSize))
                .kerning(Self.watermarkKerning)
                .foregroundStyle(Color.white.opacity(Self.watermarkOpacity))
                .padding(.top, Self.watermarkTopInset)
                .padding(.trailing, Self.watermarkTrailingInset)
                .allowsHitTesting(false)
        }
        .clipped()
    }
}
