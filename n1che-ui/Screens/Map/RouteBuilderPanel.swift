import SwiftUI

struct RouteBuilderPanel: View {
    @Binding var routeName: String
    let stops: [ShopDisplay]
    let previewRoute: RouteResponse?
    let previewLoading: Bool
    var bottomInset: CGFloat = 0
    let onRemoveStop: (String) -> Void
    let onSave: () -> Void

    private static let hPadding: CGFloat = 16
    private static let topPadding: CGFloat = 16
    private static let bottomPadding: CGFloat = 16
    private static let countGap: CGFloat = 10
    private static let listTopGap: CGFloat = 6
    private static let rowGap: CGFloat = 12
    private static let rowVPadding: CGFloat = 10
    private static let indexFontSize: CGFloat = 18
    private static let indexWidth: CGFloat = 26
    private static let nameFontSize: CGFloat = 14
    private static let emptyVPadding: CGFloat = 24
    private static let labelOpacity: Double = 0.5
    private static let separatorOpacity: Double = 0.2

    var body: some View {
        PanelView(variant: .ink, isDraggable: true) {
            VStack(alignment: .leading, spacing: 0) {
                InputBoxView(label: "Route Name", value: $routeName, labelColor: .paper, placeholder: "Name your route")
                SubtitleView(
                    text: "\(stops.count) / \(MapViewModel.maxBuilderStops) stops",
                    color: .paper.opacity(Self.labelOpacity)
                )
                .padding(.top, Self.countGap)
                if stops.isEmpty {
                    SubtitleView(
                        text: "Tap shops on the map to add stops",
                        color: .paper.opacity(Self.labelOpacity)
                    )
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, Self.emptyVPadding)
                } else {
                    VStack(spacing: 0) {
                        ForEach(Array(stops.enumerated()), id: \.element.id) { index, stop in
                            stopRow(index: index, stop: stop)
                        }
                    }
                    .padding(.top, Self.listTopGap)
                }
                if let previewRoute {
                    HStack(spacing: Spacing.lg) {
                        RouteStatColumnView(stat: .dist, value: StringUtils.formatRouteDistance(meters: previewRoute.distanceMeters))
                        RouteStatColumnView(stat: .time, value: StringUtils.formatRouteTime(minutes: previewRoute.totalMinutes))
                    }
                    .padding(.top, Spacing.md)
                } else if previewLoading {
                    ProgressView()
                        .tint(.paper)
                        .padding(.top, Spacing.md)
                }
                NicheButton(
                    "Save Route",
                    variant: .cta,
                    disabled: stops.count < MapViewModel.minBuilderStops,
                    action: onSave
                )
                .padding(.top, Spacing.md)
            }
            .padding(.horizontal, Self.hPadding)
            .padding(.top, Self.topPadding)
            .padding(.bottom, bottomInset + Self.bottomPadding)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
    }

    private func stopRow(index: Int, stop: ShopDisplay) -> some View {
        HStack(spacing: Self.rowGap) {
            Text(String(format: "%02d", index + 1))
                .font(.bebas(Self.indexFontSize))
                .foregroundStyle(Color.paper)
                .frame(width: Self.indexWidth, alignment: .leading)
            Text(stop.name)
                .font(.special(Self.nameFontSize))
                .foregroundStyle(Color.paper)
                .lineLimit(1)
            Spacer()
            NicheButton(variant: .icon, action: { onRemoveStop(stop.id) }) {
                IconView(icon: .close, size: IconSize.sm)
            }
        }
        .padding(.vertical, Self.rowVPadding)
        .bottomBorder(Color.paper.opacity(Self.separatorOpacity))
    }
}
