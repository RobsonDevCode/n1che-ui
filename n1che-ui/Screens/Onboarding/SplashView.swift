import SwiftUI

struct SplashView: View {
    @Environment(AuthStore.self) private var authStore
    @Environment(NicheStore.self) private var nicheStore
    @Environment(AppCoordinator.self) private var coordinator
    @State private var viewModel = SplashViewModel()
    @State private var session = AuthSessionViewModel()
    @State private var ctaPanelHeight: CGFloat = 0

    private static let headerHeightRatio: CGFloat = 0.30
    private static let headerMinHeight: CGFloat = 170
    private static let watermarkHeightRatio: CGFloat = 0.13
    private static let watermarkKerning: CGFloat = -2
    private static let watermarkOpacity: Double = 0.05
    private static let watermarkTopInset: CGFloat = 10
    private static let watermarkTrailingInset: CGFloat = 5
    private static let titleWidthRatio: CGFloat = 0.20
    private static let titleKerning: CGFloat = 2
    private static let badgeRowGap: CGFloat = 10
    private static let badgeRowBottomGap: CGFloat = 20
    private static let issueHPadding: CGFloat = 8
    private static let issueVPadding: CGFloat = 3
    private static let issueRotation: Double = -1
    private static let issueFontSize: CGFloat = 9
    private static let issueKerning: CGFloat = 1.5
    private static let dateFontSize: CGFloat = 9
    private static let dateKerning: CGFloat = 1.2
    private static let dateOpacity: Double = 0.4
    private static let taglineFontSize: CGFloat = 14
    private static let taglineOpacity: Double = 0.6
    private static let taglineTopGap: CGFloat = 8
    private static let separatorHeight: CGFloat = 4
    private static let ctaGap: CGFloat = 8
    private static let ctaMinBottomPadding: CGFloat = 14

    var body: some View {
        GeometryReader { geo in
            let fullHeight = geo.size.height + geo.safeAreaInsets.top + geo.safeAreaInsets.bottom

            ZStack(alignment: .bottom) {
                VStack(spacing: 0) {
                    InkHeaderView {
                        header(
                            width: geo.size.width,
                            height: max(fullHeight * Self.headerHeightRatio - geo.safeAreaInsets.top, Self.headerMinHeight),
                            watermarkSize: (fullHeight * Self.watermarkHeightRatio).rounded()
                        )
                    }
                    Rectangle()
                        .fill(Color.pop)
                        .frame(height: Self.separatorHeight)
                    CorkBoardView(shops: viewModel.shops, bottomInset: ctaPanelHeight)
                }
                PanelView {
                    cta
                        .padding(.horizontal, Spacing.lg)
                        .padding(.top, Spacing.md)
                        .padding(.bottom, max(geo.safeAreaInsets.bottom, Self.ctaMinBottomPadding))
                }
                .onGeometryChange(for: CGFloat.self) { proxy in
                    proxy.size.height
                } action: { height in
                    ctaPanelHeight = height
                }
            }
            .ignoresSafeArea(edges: .bottom)
        }
        .background(Color.paper)
        .task { await viewModel.loadShops() }
    }

    private func header(width: CGFloat, height: CGFloat, watermarkSize: CGFloat) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(spacing: Self.badgeRowGap) {
                Text("ISSUE №01")
                    .font(.mono(Self.issueFontSize))
                    .kerning(Self.issueKerning)
                    .foregroundStyle(Color.white)
                    .padding(.horizontal, Self.issueHPadding)
                    .padding(.vertical, Self.issueVPadding)
                    .background(Color.pop)
                    .rotationEffect(.degrees(Self.issueRotation))
                Text("\(String(Calendar.current.component(.year, from: .now))) · LONDON")
                    .font(.mono(Self.dateFontSize))
                    .kerning(Self.dateKerning)
                    .foregroundStyle(Color.white.opacity(Self.dateOpacity))
            }
            .padding(.bottom, Self.badgeRowBottomGap)
            HeaderTitleView(
                text: "NICHE",
                size: (width * Self.titleWidthRatio).rounded(),
                kerning: Self.titleKerning
            )
            TaglineView(
                text: "Find the stores your\npeople actually shop at.",
                size: Self.taglineFontSize,
                color: .white.opacity(Self.taglineOpacity)
            )
            .fixedSize(horizontal: false, vertical: true)
            .padding(.top, Self.taglineTopGap)
            Spacer(minLength: 0)
        }
        .padding(.horizontal, Spacing.lg)
        .padding(.vertical, Spacing.md)
        .frame(maxWidth: .infinity, alignment: .leading)
        .frame(height: height)
        .overlay(alignment: .topTrailing) {
            Text("NICHE")
                .font(.bebas(watermarkSize))
                .kerning(Self.watermarkKerning)
                .foregroundStyle(Color.white.opacity(Self.watermarkOpacity))
                .padding(.top, Self.watermarkTopInset)
                .padding(.trailing, Self.watermarkTrailingInset)
                .allowsHitTesting(false)
        }
        .clipped()
    }

    private var cta: some View {
        VStack(spacing: Self.ctaGap) {
            if authStore.isAuthenticated {
                NicheButton(nicheStore.selectedNiche != nil ? "ENTER THE MAP" : "FIND YOUR NICHE", variant: .primary, cornerRadius: CornerRadius.soft, trailingIcon: .arrowRight) {
                    coordinator.push(nicheStore.selectedNiche != nil ? .map : .nichePicker)
                }
                NicheButton("SIGN OUT", variant: .cta) {
                    Task { await session.signOut(clearing: authStore) }
                }
            } else {
                NicheButton("LOG IN", variant: .primary, cornerRadius: CornerRadius.soft, trailingIcon: .arrowRight) {
                    coordinator.push(.logIn)
                }
                NicheButton("CREATE AN ACCOUNT", variant: .cta) {
                    coordinator.push(.signUp)
                }
            }
        }
    }
}
