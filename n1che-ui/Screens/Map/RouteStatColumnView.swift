import SwiftUI

// Label-over-value stat used on the ink route panels
struct RouteStatColumnView: View {
    let stat: RouteStat
    let value: String

    private static let labelFontSize: CGFloat = 10
    private static let labelGap: CGFloat = 5
    private static let labelOpacity: Double = 0.5

    var body: some View {
        VStack(alignment: .leading, spacing: Self.labelGap) {
            SubtitleView(text: stat.rawValue, size: Self.labelFontSize, color: .paper.opacity(Self.labelOpacity))
            TitleView(text: value, size: FontSize.h3, color: .paper)
        }
    }
}
