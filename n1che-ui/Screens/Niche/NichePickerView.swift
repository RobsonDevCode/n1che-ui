import SwiftUI

struct NichePickerView: View {
    @Environment(NicheStore.self) private var nicheStore
    @Environment(AppCoordinator.self) private var coordinator
    @State private var selectedID: String? = nil

    private static let headerVPadding: CGFloat = 16
    private static let stepFontSize: CGFloat = 9
    private static let stepKerning: CGFloat = 2
    private static let stepOpacity: Double = 0.4
    private static let stepBottomGap: CGFloat = 6
    private static let titleFontSize: CGFloat = 46
    private static let titleKerning: CGFloat = 1.5
    private static let taglineFontSize: CGFloat = 13
    private static let taglineOpacity: Double = 0.5
    private static let taglineMaxWidth: CGFloat = 120
    private static let separatorHeight: CGFloat = 4
    private static let listHPadding: CGFloat = 16
    private static let listVPadding: CGFloat = 14
    private static let rowGap: CGFloat = 2
    private static let footerHPadding: CGFloat = 16
    private static let footerTopPadding: CGFloat = 12
    private static let footerMinBottomPadding: CGFloat = 14
    private static let footerBorderHeight: CGFloat = 3

    private var selectedNiche: Niche? {
        allNiches.first { $0.id == selectedID }
    }

    var body: some View {
        GeometryReader { geo in
            VStack(spacing: 0) {
                InkHeaderView { header }
                Rectangle()
                    .fill(Color.pop)
                    .frame(height: Self.separatorHeight)
                ScrollView {
                    VStack(spacing: Self.rowGap) {
                        ForEach(Array(allNiches.enumerated()), id: \.element.id) { index, niche in
                            NicheRowView(
                                niche: niche,
                                index: index,
                                isSelected: selectedID == niche.id
                            ) {
                                selectedID = niche.id
                            }
                        }
                    }
                    .padding(.horizontal, Self.listHPadding)
                    .padding(.vertical, Self.listVPadding)
                }
                footer(bottomInset: geo.safeAreaInsets.bottom)
            }
            .ignoresSafeArea(edges: .bottom)
        }
        .background(Color.paper)
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                NicheButton("Back", variant: .ghost, leadingIcon: .arrowLeft) {
                    coordinator.pop()
                }
                Spacer()
            }
            Text("STEP 01 / 02")
                .font(.mono(Self.stepFontSize))
                .kerning(Self.stepKerning)
                .foregroundStyle(Color.white.opacity(Self.stepOpacity))
                .padding(.bottom, Self.stepBottomGap)
            HStack(alignment: .bottom) {
                HeaderTitleView(
                    text: "YOUR\nNICHE",
                    size: Self.titleFontSize,
                    kerning: Self.titleKerning
                )
                Spacer()
                TaglineView(
                    text: "pick what fits.\nadd more later.",
                    size: Self.taglineFontSize,
                    color: .white.opacity(Self.taglineOpacity)
                )
                .multilineTextAlignment(.trailing)
                .frame(maxWidth: Self.taglineMaxWidth, alignment: .trailing)
            }
        }
        .padding(.horizontal, Spacing.lg)
        .padding(.vertical, Self.headerVPadding)
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private func footer(bottomInset: CGFloat) -> some View {
        VStack(spacing: 0) {
            Rectangle()
                .fill(Color.inkCol)
                .frame(height: Self.footerBorderHeight)
            NicheButton(
                selectedNiche.map { "CONTINUE — \($0.label.uppercased())" } ?? "SELECT A NICHE",
                variant: .primary,
                disabled: selectedID == nil
            ) {
                nicheStore.selectedNiche = selectedID
                coordinator.push(.map)
            }
            .padding(.horizontal, Self.footerHPadding)
            .padding(.top, Self.footerTopPadding)
            .padding(.bottom, max(bottomInset, Self.footerMinBottomPadding))
        }
        .background(Color.paper)
    }
}
