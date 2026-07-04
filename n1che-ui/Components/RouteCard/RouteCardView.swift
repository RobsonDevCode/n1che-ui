import SwiftUI

struct RouteCardView: View {
    let route: RouteResponse
    let rank: Int
    let selected: Bool
    let onTap: () -> Void

    private static let maxVisibleStops = 5
    private static let borderWidth: CGFloat = 1.5
    private static let cardPadding: CGFloat = 13
    private static let topRowGap: CGFloat = 10
    private static let topRowBottomGap: CGFloat = 10
    private static let rankSize: CGFloat = 26
    private static let rankFontSize: CGFloat = 11
    private static let rankKerning: CGFloat = 0.5
    private static let nameFontSize: CGFloat = 19
    private static let nameKerning: CGFloat = 0.5
    private static let createdByFontSize: CGFloat = 9
    private static let createdByKerning: CGFloat = 0.5
    private static let createdByTopGap: CGFloat = 1
    private static let votesGap: CGFloat = 1
    private static let votesLabelFontSize: CGFloat = 7
    private static let votesLabelKerning: CGFloat = 1
    private static let votesValueFontSize: CGFloat = 15
    private static let statsRowGap: CGFloat = 10
    private static let statsBottomGap: CGFloat = 11
    private static let statsFontSize: CGFloat = 10
    private static let statsKerning: CGFloat = 0.3
    private static let tagBorderWidth: CGFloat = 1
    private static let tagHPadding: CGFloat = 6
    private static let tagVPadding: CGFloat = 2
    private static let tagFontSize: CGFloat = 8
    private static let tagKerning: CGFloat = 1
    private static let sequenceGap: CGFloat = 5
    private static let stopItemGap: CGFloat = 4
    private static let stopDotSize: CGFloat = 7
    private static let stopNameFontSize: CGFloat = 9.5
    private static let stopNameKerning: CGFloat = 0.3
    private static let arrowFontSize: CGFloat = 11
    private static let showingRowGap: CGFloat = 6
    private static let showingTopGap: CGFloat = 11
    private static let showingTopPadding: CGFloat = 10
    private static let showingBorderWidth: CGFloat = 1
    private static let showingDotSize: CGFloat = 7
    private static let showingFontSize: CGFloat = 9
    private static let showingKerning: CGFloat = 1.5
    private static let mutedOpacity: Double = 0.6
    private static let tagBorderOpacity: Double = 0.5
    private static let showingBorderOpacity: Double = 0.2

    var body: some View {
        let fg = selected ? Color.paper : Color.inkCol
        let muted = selected ? Color.paper.opacity(Self.mutedOpacity) : Color.grey

        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 0) {
                topRow(fg: fg, muted: muted)
                    .padding(.bottom, Self.topRowBottomGap)
                statsRow(fg: fg, muted: muted)
                    .padding(.bottom, Self.statsBottomGap)
                sequence(fg: fg, muted: muted)
                if selected {
                    showingRow
                        .padding(.top, Self.showingTopGap)
                }
            }
            .padding(Self.cardPadding)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(selected ? Color.inkCol : Color.white)
            .border(Color.inkCol, width: Self.borderWidth)
        }
        .buttonStyle(.plain)
    }

    private func topRow(fg: Color, muted: Color) -> some View {
        HStack(spacing: Self.topRowGap) {
            Text(String(format: "%02d", rank))
                .font(.mono(Self.rankFontSize))
                .kerning(Self.rankKerning)
                .foregroundStyle(selected ? Color.inkCol : Color.white)
                .frame(width: Self.rankSize, height: Self.rankSize)
                .background(fg)
            VStack(alignment: .leading, spacing: Self.createdByTopGap) {
                Text(route.name)
                    .font(.bebas(Self.nameFontSize))
                    .kerning(Self.nameKerning)
                    .foregroundStyle(fg)
                    .lineLimit(1)
                Text("@\(route.createdBy)")
                    .font(.mono(Self.createdByFontSize))
                    .kerning(Self.createdByKerning)
                    .foregroundStyle(muted)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            VStack(alignment: .trailing, spacing: Self.votesGap) {
                Text("UPVOTES")
                    .font(.mono(Self.votesLabelFontSize))
                    .kerning(Self.votesLabelKerning)
                    .foregroundStyle(muted)
                Text("↑\(route.totalUpvotes)")
                    .font(.mono(Self.votesValueFontSize))
                    .foregroundStyle(fg)
            }
        }
    }

    private func statsRow(fg: Color, muted: Color) -> some View {
        HStack(spacing: Self.statsRowGap) {
            Text("\(route.stops.count) STOPS · \(route.estimatedRouteTime) · \(route.totalDistanceStr)")
                .font(.mono(Self.statsFontSize))
                .kerning(Self.statsKerning)
                .foregroundStyle(muted)
                .frame(maxWidth: .infinity, alignment: .leading)
            Text(route.tag)
                .font(.mono(Self.tagFontSize))
                .kerning(Self.tagKerning)
                .foregroundStyle(fg)
                .padding(.horizontal, Self.tagHPadding)
                .padding(.vertical, Self.tagVPadding)
                .border(
                    selected ? Color.paper.opacity(Self.tagBorderOpacity) : Color.inkCol,
                    width: Self.tagBorderWidth
                )
        }
    }

    private func sequence(fg: Color, muted: Color) -> some View {
        let visibleStops = Array(route.stops.prefix(Self.maxVisibleStops))
        let hasMore = route.stops.count > Self.maxVisibleStops

        return FlowLayout(spacing: Self.sequenceGap) {
            ForEach(Array(visibleStops.enumerated()), id: \.element.id) { i, stop in
                HStack(spacing: Self.stopItemGap) {
                    Circle()
                        .fill(Color.pinColors[i % Color.pinColors.count])
                        .frame(width: Self.stopDotSize, height: Self.stopDotSize)
                    Text(stop.name)
                        .font(.mono(Self.stopNameFontSize))
                        .kerning(Self.stopNameKerning)
                        .foregroundStyle(fg)
                    if i < visibleStops.count - 1 {
                        Text("›")
                            .font(.system(size: Self.arrowFontSize))
                            .foregroundStyle(muted)
                    }
                }
            }
            if hasMore {
                Text("›")
                    .font(.system(size: Self.arrowFontSize))
                    .foregroundStyle(muted)
                Text("…")
                    .font(.mono(Self.stopNameFontSize))
                    .foregroundStyle(muted)
            }
        }
    }

    private var showingRow: some View {
        HStack(spacing: Self.showingRowGap) {
            Circle()
                .fill(Color.liveGreen)
                .frame(width: Self.showingDotSize, height: Self.showingDotSize)
            Text("SHOWING ON MAP")
                .font(.mono(Self.showingFontSize))
                .kerning(Self.showingKerning)
                .foregroundStyle(Color.paper)
        }
        .padding(.top, Self.showingTopPadding)
        .frame(maxWidth: .infinity, alignment: .leading)
        .overlay(alignment: .top) {
            Rectangle()
                .fill(Color.paper.opacity(Self.showingBorderOpacity))
                .frame(height: Self.showingBorderWidth)
        }
    }
}
