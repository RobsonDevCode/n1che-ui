import SwiftUI

struct AddShopPanel: View {
    let place: ShopDisplay
    let submitting: Bool
    var bottomInset: CGFloat = 0
    let onSubmit: () -> Void
    let onBack: () -> Void

    private static let nameFontSize: CGFloat = 24
    private static let actionsPadding: CGFloat = 16
    private static let backButtonPadding: CGFloat = 12
    private static let backIconSize: CGFloat = 16

    var body: some View {
        PanelView {
            VStack(spacing: 0) {
                ShopHeroView(
                    name: place.name,
                    addressLine: place.address,
                    photoUrl: place.photoUrl,
                    palIdx: place.palIdx,
                    nameSize: Self.nameFontSize
                )
                .overlay(alignment: .topTrailing) { backButton }
                NicheButton(
                    "Add Shop",
                    variant: .primary,
                    loading: submitting,
                    cornerRadius: CornerRadius.soft,
                    action: onSubmit
                )
                .padding(Self.actionsPadding)
                Spacer(minLength: bottomInset)
            }
        }
    }

    private var backButton: some View {
        NicheButton(variant: .icon, action: onBack) {
            IconView(icon: .arrowLeft, size: Self.backIconSize)
        }
        .padding(Self.backButtonPadding)
    }
}
