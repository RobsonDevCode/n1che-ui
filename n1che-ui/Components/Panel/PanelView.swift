import SwiftUI

struct PanelView<Content: View>: View {
    private static var paperShadowOpacity: Double { 0.12 }
    private static var inkShadowOpacity: Double { 0.3 }
    private static var shadowRadius: CGFloat { 20 }
    private static var shadowYOffset: CGFloat { -10 }
    private static var handleWidth: CGFloat { 36 }
    private static var handleHeight: CGFloat { 4 }
    private static var handleVPadding: CGFloat { 8 }
    private static var handleOpacity: Double { 0.35 }
    // How much of a collapsed panel stays on screen so it can be dragged back up
    private static var collapsedPeekHeight: CGFloat { 56 }
    private static var snapAnimDuration: TimeInterval { 0.25 }

    var variant: PanelVariant = .paper
    // Adds a grab handle; dragging down collapses the panel to a peek strip
    var isDraggable: Bool = false
    @ViewBuilder let content: () -> Content

    @State private var panelHeight: CGFloat = 0
    @State private var offsetY: CGFloat = 0
    @State private var dragStartOffset: CGFloat? = nil

    // Furthest the panel can slide down — shared by the drag clamp, the
    // end-of-drag snap, and the re-clamp when content height changes
    private var maxOffset: CGFloat {
        max(panelHeight - Self.collapsedPeekHeight, 0)
    }

    var body: some View {
        VStack(spacing: 0) {
            if isDraggable {
                dragHandle
            }
            content()
        }
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
        .onGeometryChange(for: CGFloat.self, of: { $0.size.height }) { height in
            panelHeight = height
            offsetY = min(offsetY, maxOffset)
        }
        .offset(y: offsetY)
    }

    private var dragHandle: some View {
        Capsule()
            .fill((variant == .paper ? Color.inkCol : Color.paper).opacity(Self.handleOpacity))
            .frame(width: Self.handleWidth, height: Self.handleHeight)
            .frame(maxWidth: .infinity)
            .padding(.vertical, Self.handleVPadding)
            .contentShape(Rectangle())
            .gesture(
                DragGesture()
                    .onChanged { value in
                        if dragStartOffset == nil {
                            dragStartOffset = offsetY
                        }
                        offsetY = min(max((dragStartOffset ?? 0) + value.translation.height, 0), maxOffset)
                    }
                    .onEnded { value in
                        let projected = (dragStartOffset ?? 0) + value.predictedEndTranslation.height
                        dragStartOffset = nil
                        withAnimation(.easeOut(duration: Self.snapAnimDuration)) {
                            offsetY = projected > maxOffset / 2 ? maxOffset : 0
                        }
                    }
            )
    }
}
