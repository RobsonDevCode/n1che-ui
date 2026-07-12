import SwiftUI

struct RoutePanel: View {
    let route: RouteResponse?
    let loading: Bool
    let errorMessage: String?
    var bottomInset: CGFloat = 0
    let onBegin: () -> Void
    let onExit: () -> Void

    private static let hPadding: CGFloat = 20
    private static let topPadding: CGFloat = 20
    private static let bottomPadding: CGFloat = 24
    private static let titleFontSize: CGFloat = 35
    private static let titleRowGap: CGFloat = 15
    private static let subtitleGap: CGFloat = 3
    private static let subtitleOpacity: Double = 0.55
    private static let exitIconSize: CGFloat = 16
    private static let statusVPadding: CGFloat = 32
    private static let statusOpacity: Double = 0.5
    private static let etaFontSize: CGFloat = 60
    private static let etaKerning: CGFloat = -1
    private static let etaBlockGap: CGFloat = 20
    private static let etaBottomGap: CGFloat = 28
    private static let statColumnGap: CGFloat = 22
    private static let statLabelGap: CGFloat = 5
    private static let statLabelFontSize: CGFloat = 10
    private static let statValueFontSize: CGFloat = 22
    private static let statBottomPadding: CGFloat = 6

    private var subtitle: String {
        guard let route else { return "FROM YOU" }
        return "\(route.tag) · \(route.mode == .you ? "FROM YOU" : "LOOP") · BY @\(route.createdBy)"
    }

    var body: some View {
        PanelView(variant: .ink) {
            VStack(alignment: .leading, spacing: 0) {
                titleRow
                    .padding(.bottom, Self.titleRowGap)
                if loading {
                    ProgressView()
                        .tint(.paper)
                        .controlSize(.large)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, Self.statusVPadding)
                } else if let errorMessage {
                    SubtitleView(text: errorMessage, color: .paper.opacity(Self.statusOpacity))
                        .padding(.vertical, Self.statusVPadding)
                } else if let route {
                    etaBlock(for: route)
                        .padding(.bottom, Self.etaBottomGap)
                }
                NicheButton(
                    "Begin Route",
                    variant: .cta,
                    disabled: route == nil,
                    trailingIcon: .arrowRight,
                    action: onBegin
                )
            }
            .padding(.horizontal, Self.hPadding)
            .padding(.top, Self.topPadding)
            .padding(.bottom, bottomInset + Self.bottomPadding)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
    }

    private var titleRow: some View {
        HStack(alignment: .top) {
            VStack(alignment: .leading, spacing: Self.subtitleGap) {
                TitleView(text: route?.name ?? "BEST ROUTE", size: Self.titleFontSize, color: .paper)
                SubtitleView(text: subtitle, color: .paper.opacity(Self.subtitleOpacity))
            }
            Spacer()
            NicheButton(variant: .icon, action: onExit) {
                IconView(icon: .arrowLeft, size: Self.exitIconSize)
            }
        }
    }

    private func etaBlock(for route: RouteResponse) -> some View {
        HStack(alignment: .bottom, spacing: Self.etaBlockGap) {
            TitleView(
                text: StringUtils.formatRouteTime(minutes: route.totalMinutes),
                size: Self.etaFontSize,
                color: .paper,
                kerning: Self.etaKerning
            )
            HStack(spacing: Self.statColumnGap) {
                if route.stops.count > 1 {
                    statColumn(label: "STOPS", value: "\(route.stops.count)")
                }
                statColumn(label: "DIST", value: StringUtils.formatRouteDistance(meters: route.distanceMeters))
                statColumn(label: "UPVOTES", value: "↑\(route.totalUpvotes)")
            }
            .padding(.bottom, Self.statBottomPadding)
        }
    }

    private func statColumn(label: String, value: String) -> some View {
        VStack(alignment: .leading, spacing: Self.statLabelGap) {
            SubtitleView(text: label, size: Self.statLabelFontSize, color: .paper.opacity(Self.statusOpacity))
            TitleView(text: value, size: Self.statValueFontSize, color: .paper)
        }
    }
}
