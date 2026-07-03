import SwiftUI

struct InkHeaderView<Content: View>: View {
    @ViewBuilder let content: () -> Content

    var body: some View {
        content()
            .background(
                Color.inkCol.ignoresSafeArea(edges: .top)
            )
    }
}
