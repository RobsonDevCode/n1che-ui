import SwiftUI

struct AuthLayoutView<Content: View>: View {
    let title: String
    let onBack: () -> Void
    @ViewBuilder let content: () -> Content

    private static var headerHeightRatio: CGFloat { 0.22 }
    private static var headerMinHeight: CGFloat { 120 }
    private static var watermarkHeightRatio: CGFloat { 0.09 }
    private static var separatorHeight: CGFloat { 4 }
    private static var formMinBottomPadding: CGFloat { 24 }

    var body: some View {
        GeometryReader { geo in
            let fullHeight = geo.size.height + geo.safeAreaInsets.top + geo.safeAreaInsets.bottom

            VStack(spacing: 0) {
                InkHeaderView {
                    AuthHeaderView(
                        title: title,
                        height: max(fullHeight * Self.headerHeightRatio - geo.safeAreaInsets.top, Self.headerMinHeight),
                        watermarkSize: (fullHeight * Self.watermarkHeightRatio).rounded(),
                        onBack: onBack
                    )
                }
                Rectangle()
                    .fill(Color.pop)
                    .frame(height: Self.separatorHeight)
                ScrollView {
                    VStack(alignment: .leading, spacing: 0) {
                        content()
                    }
                    .padding(.horizontal, Spacing.lg)
                    .padding(.top, Spacing.lg)
                    .padding(.bottom, max(geo.safeAreaInsets.bottom, Self.formMinBottomPadding))
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
                .background(Color.paper)
            }
        }
        .background(Color.paper)
    }
}
