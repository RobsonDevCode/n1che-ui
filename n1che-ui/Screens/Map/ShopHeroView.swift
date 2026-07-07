import SwiftUI

// Photo hero shared by ShopPanel and AddShopPanel — palette fill with the
// shop's initial when no photo exists, name + address pinned to the bottom
struct ShopHeroView: View {
    let name: String
    let addressLine: String
    let photoUrl: String?
    let palIdx: Int
    var nameSize: CGFloat = Self.defaultNameSize

    private static let height: CGFloat = 140
    private static let initialFontSize: CGFloat = 72
    private static let initialOpacity: Double = 0.18
    private static let gradientOpacity: Double = 0.65
    private static let infoPadding: CGFloat = 14
    private static let defaultNameSize: CGFloat = 28
    private static let addressFontSize: CGFloat = 12
    private static let addressOpacity: Double = 0.72
    private static let infoGap: CGFloat = 2

    var body: some View {
        ZStack {
            Color.polPalette[palIdx % Color.polPalette.count]
            if let url = photoUrl.flatMap(URL.init) {
                AsyncImage(url: url) { image in
                    image.resizable().scaledToFill()
                } placeholder: {
                    Color.clear
                }
                .frame(maxWidth: .infinity)
                .frame(height: Self.height)
                .clipped()
            } else {
                TitleView(
                    text: String(name.prefix(1)).uppercased(),
                    size: Self.initialFontSize,
                    color: .white.opacity(Self.initialOpacity)
                )
            }
            LinearGradient(
                colors: [.clear, .black.opacity(Self.gradientOpacity)],
                startPoint: .top,
                endPoint: .bottom
            )
            VStack(alignment: .leading, spacing: Self.infoGap) {
                TitleView(text: name.uppercased(), size: nameSize, color: .white)
                Text(addressLine)
                    .font(.special(Self.addressFontSize))
                    .foregroundStyle(.white.opacity(Self.addressOpacity))
            }
            .padding(Self.infoPadding)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomLeading)
        }
        .frame(height: Self.height)
        .frame(maxWidth: .infinity)
        .clipped()
    }
}
