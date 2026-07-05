import SwiftUI

struct PanelView<Content: View>: View {
    private static var paperShadowOpacity: Double { 0.12 }
    private static var inkShadowOpacity: Double { 0.3 }
    private static var shadowRadius: CGFloat { 20 }
    private static var shadowYOffset: CGFloat { -10 }

    var variant: PanelVariant = .paper
    @ViewBuilder let content: () -> Content

    var body: some View {
        content()
            .background(variant == .paper ? Color.paper : Color.inkCol)
            .clipShape(
                .rect(
                    topLeadingRadius: CornerRadius.panel,
                    bottomLeadingRadius: 0,
                    bottomTrailingRadius: 0,
                    topTrailingRadius: CornerRadius.panel
                )
            )
            .compositingGroup()
            .shadow(
                color: .black.opacity(variant == .paper ? Self.paperShadowOpacity : Self.inkShadowOpacity),
                radius: Self.shadowRadius,
                x: 0,
                y: Self.shadowYOffset
            )
    }
}
