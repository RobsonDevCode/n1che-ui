import SwiftUI

enum PanelVariant {
    case paper, ink
}

struct PanelView<Content: View>: View {
    var variant: PanelVariant = .paper
    @ViewBuilder let content: () -> Content

    var body: some View {
        content()
            .background(variant == .paper ? Color.paper : Color.inkCol)
            .clipShape(
                .rect(
                    topLeadingRadius: 26,
                    bottomLeadingRadius: 0,
                    bottomTrailingRadius: 0,
                    topTrailingRadius: 26
                )
            )
            .shadow(
                color: .black.opacity(variant == .paper ? 0.12 : 0.3),
                radius: 20,
                x: 0,
                y: -10
            )
    }
}
