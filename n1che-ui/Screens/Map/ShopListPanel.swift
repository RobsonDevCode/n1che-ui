import SwiftUI

struct ShopListPanel: View {
    let shops: [ShopDisplay]
    let nicheLabel: String
    var bottomInset: CGFloat = 0
    let onSelectShop: (ShopDisplay) -> Void
    let onBack: () -> Void

    private static let headerHPadding: CGFloat = 16
    private static let headerVPadding: CGFloat = 12
    private static let headerTitleSize: CGFloat = 20
    private static let backIconSize: CGFloat = 20
    private static let inkBorderHeight: CGFloat = 2
    private static let emptyGap: CGFloat = 10
    private static let emptyPadding: CGFloat = 32
    private static let emptyTitleSize: CGFloat = 22
    private static let emptyLineSpacing: CGFloat = 7
    private static let minBottomPadding: CGFloat = 16

    var body: some View {
        PanelView {
            VStack(spacing: 0) {
                header
                if shops.isEmpty {
                    emptyState
                } else {
                    list
                }
            }
        }
    }

    private var header: some View {
        HStack {
            TitleView(text: "\(shops.count) SHOPS NEARBY", size: Self.headerTitleSize)
            Spacer()
            Button(action: onBack) {
                IconView(icon: .arrowLeft, size: Self.backIconSize, color: .inkCol)
            }
        }
        .padding(.horizontal, Self.headerHPadding)
        .padding(.vertical, Self.headerVPadding)
        .background(Color.white)
        .bottomBorder(.inkCol, height: Self.inkBorderHeight)
    }

    private var emptyState: some View {
        VStack(spacing: Self.emptyGap) {
            TitleView(text: "NO SHOPS NEARBY", size: Self.emptyTitleSize)
            Text("We don't have any \(nicheLabel.lowercased()) shops in your area yet.\nTry searching for a location above.")
                .font(.special(FontSize.small))
                .foregroundStyle(Color.grey)
                .multilineTextAlignment(.center)
                .lineSpacing(Self.emptyLineSpacing)
        }
        .padding(Self.emptyPadding)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private var list: some View {
        ScrollView(showsIndicators: false) {
            LazyVStack(spacing: 0) {
                ForEach(Array(shops.enumerated()), id: \.element.id) { index, shop in
                    ShopCardView(shop: shop, index: index) {
                        onSelectShop(shop)
                    }
                }
                Color.clear
                    .frame(height: max(bottomInset, Self.minBottomPadding))
            }
        }
    }
}
