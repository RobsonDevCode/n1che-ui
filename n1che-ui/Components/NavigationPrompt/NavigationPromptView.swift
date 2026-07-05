import SwiftUI

struct NavigationPromptView: View {
    let progress: NavProgress
    let muted: Bool
    let onToggleMute: () -> Void

    private static let hPadding: CGFloat = 16
    private static let topPadding: CGFloat = 10
    private static let bottomPadding: CGFloat = 14
    private static let topRowBottomGap: CGFloat = 10
    private static let metaFontSize: CGFloat = 10
    private static let metaKerning: CGFloat = 1.5
    private static let metaOpacity: Double = 0.55
    private static let muteBorderOpacity: Double = 0.3
    private static let muteBorderWidth: CGFloat = 1
    private static let muteHPadding: CGFloat = 7
    private static let muteVPadding: CGFloat = 3
    private static let muteFontSize: CGFloat = 9
    private static let muteKerning: CGFloat = 1
    private static let muteOffOpacity: Double = 0.35
    private static let mainRowGap: CGFloat = 14
    private static let mainRowBottomGap: CGFloat = 8
    private static let arrowBoxSize: CGFloat = 44
    private static let instructionKerning: CGFloat = 0.5
    private static let instructionLineSpacing: CGFloat = 2
    private static let thenRowGap: CGFloat = 8
    private static let thenLabelFontSize: CGFloat = 9
    private static let thenLabelKerning: CGFloat = 1.5
    private static let thenLabelOpacity: Double = 0.45
    private static let thenIconFontSize: CGFloat = 13
    private static let thenOpacity: Double = 0.7
    private static let thenInstructionFontSize: CGFloat = 10
    private static let thenInstructionKerning: CGFloat = 0.5

    var body: some View {
        let isRerouting = progress.state == .rerouting

        VStack(alignment: .leading, spacing: 0) {
            topRow(isRerouting: isRerouting)
                .padding(.bottom, Self.topRowBottomGap)
            mainRow
                .padding(.bottom, Self.mainRowBottomGap)
            if !isRerouting, let next = progress.nextManeuver, !progress.nextInstruction.isEmpty {
                thenRow(next: next)
            }
        }
        .padding(.horizontal, Self.hPadding)
        .padding(.top, Self.topPadding)
        .padding(.bottom, Self.bottomPadding)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.inkCol.ignoresSafeArea(edges: .top))
    }

    private func topRow(isRerouting: Bool) -> some View {
        HStack {
            Text(isRerouting ? "RECALCULATING…" : metaLine)
                .font(.mono(Self.metaFontSize))
                .kerning(Self.metaKerning)
                .foregroundStyle(Color.paper.opacity(Self.metaOpacity))
            Spacer()
            Button(action: onToggleMute) {
                Text(muted ? "×SFX" : "SFX")
                    .font(.mono(Self.muteFontSize))
                    .kerning(Self.muteKerning)
                    .foregroundStyle(muted ? Color.paper.opacity(Self.muteOffOpacity) : Color.paper)
                    .padding(.horizontal, Self.muteHPadding)
                    .padding(.vertical, Self.muteVPadding)
                    .border(Color.paper.opacity(Self.muteBorderOpacity), width: Self.muteBorderWidth)
            }
            .buttonStyle(.plain)
        }
    }

    private var mainRow: some View {
        HStack(spacing: Self.mainRowGap) {
            IconView(icon: progress.currentManeuver.icon, size: IconSize.xl)
                .frame(width: Self.arrowBoxSize, height: Self.arrowBoxSize)
                .background(Color.paper)
            Text(progress.currentInstruction.uppercased())
                .font(.bebas(FontSize.h2))
                .kerning(Self.instructionKerning)
                .foregroundStyle(Color.paper)
                .lineSpacing(Self.instructionLineSpacing)
                .lineLimit(2)
                .frame(maxWidth: .infinity, alignment: .leading)
        }
    }

    private func thenRow(next: Maneuver) -> some View {
        HStack(spacing: Self.thenRowGap) {
            Text("THEN")
                .font(.mono(Self.thenLabelFontSize))
                .kerning(Self.thenLabelKerning)
                .foregroundStyle(Color.paper.opacity(Self.thenLabelOpacity))
            IconView(
                icon: next.icon,
                size: Self.thenIconFontSize,
                color: .paper.opacity(Self.thenOpacity)
            )
            Text(progress.nextInstruction.uppercased())
                .font(.mono(Self.thenInstructionFontSize))
                .kerning(Self.thenInstructionKerning)
                .foregroundStyle(Color.paper.opacity(Self.thenOpacity))
                .lineLimit(1)
        }
    }

    private var metaLine: String {
        let displayDist = progress.distanceToNextTurnMeters.isFinite
            ? progress.distanceToNextTurnMeters
            : progress.distanceToNextStopMeters
        var parts = [StringUtils.formatMeters(displayDist)]
        if let compass = Geo.headingToCompass(progress.currentHeading) {
            parts.append("HEAD \(compass)")
        }
        return parts.filter { !$0.isEmpty }.joined(separator: " · ")
    }
}
