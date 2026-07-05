import SwiftUI

struct IssueBadgeRowView: View {
    private static let gap: CGFloat = 10
    private static let issueFontSize: CGFloat = FontSize.label
    private static let issueKerning: CGFloat = 1.5
    private static let issueHPadding: CGFloat = 8
    private static let issueVPadding: CGFloat = 3
    private static let issueRotation: Double = -1
    private static let dateFontSize: CGFloat = FontSize.label
    private static let dateKerning: CGFloat = 1.2
    private static let dateOpacity: Double = 0.4

    var body: some View {
        HStack(spacing: Self.gap) {
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
    }
}
