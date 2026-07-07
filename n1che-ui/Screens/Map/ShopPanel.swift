import SwiftUI

struct ShopPanel: View {
    @Environment(AuthStore.self) private var authStore
    @State private var viewModel = ShopPanelViewModel()

    let shop: ShopDisplay
    var bottomInset: CGFloat = 0
    let onBack: () -> Void
    let onDirections: (ShopDisplay) -> Void

    private static let headerHPadding: CGFloat = 16
    private static let headerVPadding: CGFloat = 10
    private static let inkBorderHeight: CGFloat = 2

    private static let statCellGap: CGFloat = 4
    private static let statVPadding: CGFloat = 12
    private static let statHPadding: CGFloat = 10
    private static let statValueFontSize: CGFloat = 18
    private static let statLabelFontSize: CGFloat = 7

    private static let actionsGap: CGFloat = 8
    private static let actionsPadding: CGFloat = 14

    private static let reviewsHeaderGap: CGFloat = 6
    private static let reviewsHPadding: CGFloat = 16
    private static let reviewsTopPadding: CGFloat = 14
    private static let reviewsBottomPadding: CGFloat = 10
    private static let reviewsTitleFontSize: CGFloat = 16
    private static let formPadding: CGFloat = 14
    private static let formActionsGap: CGFloat = 8
    private static let minBottomPadding: CGFloat = 16

    var body: some View {
        PanelView {
            VStack(spacing: 0) {
                header
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 0) {
                        hero
                        statsStrip
                        actions
                        reviewsSection
                        Color.clear
                            .frame(height: max(bottomInset, Self.minBottomPadding))
                    }
                }
            }
        }
        .task { await viewModel.loadReviews(shopId: shop.id) }
    }

    private var header: some View {
        HStack {
            NicheButton("Back", variant: .pill, leadingIcon: .arrowLeft, action: onBack)
            Spacer()
            OpenBadgeView(isOpen: shop.isOpen, closingTime: shop.closingTime)
        }
        .padding(.horizontal, Self.headerHPadding)
        .padding(.vertical, Self.headerVPadding)
        .background(Color.white)
        .bottomBorder(.inkCol, height: Self.inkBorderHeight)
    }

    private var hero: some View {
        ShopHeroView(
            name: shop.name,
            addressLine: shop.addressLine,
            photoUrl: shop.photoUrl,
            palIdx: shop.palIdx
        )
    }

    private var statsStrip: some View {
        HStack(spacing: 0) {
            statCell(value: "↑\(shop.voteCount)", label: "UPVOTES")
            Rectangle()
                .fill(Color.inkCol)
                .frame(width: Self.inkBorderHeight)
            statCell(value: "@\(shop.addedByUsername)", label: "ADDED BY")
        }
        .fixedSize(horizontal: false, vertical: true)
        .frame(maxWidth: .infinity)
        .background(Color.paper2)
        .bottomBorder(.inkCol, height: Self.inkBorderHeight)
    }

    private func statCell(value: String, label: String) -> some View {
        VStack(spacing: Self.statCellGap) {
            TitleView(text: value, size: Self.statValueFontSize)
                .lineLimit(1)
            SubtitleView(text: label, size: Self.statLabelFontSize)
        }
        .padding(.vertical, Self.statVPadding)
        .padding(.horizontal, Self.statHPadding)
        .frame(maxWidth: .infinity)
    }

    private var actions: some View {
        HStack(spacing: Self.actionsGap) {
            NicheButton(variant: .pill, active: viewModel.voted, action: viewModel.saveVote) {
                ButtonLabel(
                    text: viewModel.voted ? "Upvoted" : "Upvote",
                    variant: .pill,
                    active: viewModel.voted,
                    leadingIcon: viewModel.voted ? .check : .upvote
                )
                .frame(maxWidth: .infinity)
            }
            NicheButton(variant: .pill, active: viewModel.saved, action: viewModel.saveShop) {
                IconView(
                    icon: viewModel.saved ? .bookmarkFill : .bookmark,
                    size: IconSize.md,
                    color: viewModel.saved ? .white : .inkCol
                )
            }
            NicheButton(variant: .pill, action: { onDirections(shop) }) {
                IconView(icon: .directions, size: IconSize.md)
            }
        }
        .padding(Self.actionsPadding)
        .background(Color.paper)
    }

    private var reviewsSection: some View {
        VStack(spacing: 0) {
            Rectangle()
                .fill(Color.inkCol)
                .frame(height: Self.inkBorderHeight)
            HStack(alignment: .firstTextBaseline, spacing: Self.reviewsHeaderGap) {
                TitleView(text: "COMMUNITY REVIEWS", size: Self.reviewsTitleFontSize)
                SubtitleView(text: "(\(viewModel.reviews.count))")
                Spacer()
            }
            .padding(.horizontal, Self.reviewsHPadding)
            .padding(.top, Self.reviewsTopPadding)
            .padding(.bottom, Self.reviewsBottomPadding)
            .bottomBorder()

            ForEach(viewModel.reviews) { review in
                ReviewCardView(review: review)
            }

            if viewModel.showReviewForm {
                reviewForm
            } else {
                NicheButton("Write a Review", variant: .cta, leadingIcon: .plus) {
                    viewModel.showReviewForm = true
                }
                .padding(Self.formPadding)
            }
        }
    }

    private var reviewForm: some View {
        VStack(spacing: 0) {
            InputBoxView(
                label: "Your Review",
                value: $viewModel.reviewText,
                placeholder: "Share your experience…",
                isMultiline: true
            )
            HStack(spacing: Self.formActionsGap) {
                NicheButton("Cancel", variant: .cta, action: viewModel.cancelReview)
                NicheButton("Submit", variant: .primary, disabled: !viewModel.canSubmitReview, rotate: 0, cornerRadius: CornerRadius.soft) {
                    Task {
                        await viewModel.submitReview(
                            shopId: shop.id,
                            username: authStore.username ?? "anonymous"
                        )
                    }
                }
            }
        }
        .padding(Self.formPadding)
    }
}
