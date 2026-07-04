import SwiftUI

struct SearchDropdownView: View {
    let shopResults: [ShopDisplay]
    let placeResults: [PlacePrediction]
    let onSelectShop: (ShopDisplay) -> Void
    let onSelectPlace: (PlacePrediction) -> Void

    private static let maxHeight: CGFloat = 260
    private static let borderWidth: CGFloat = 2
    private static let sectionFontSize: CGFloat = 8
    private static let sectionKerning: CGFloat = 2
    private static let sectionHPadding: CGFloat = 14
    private static let sectionTopPadding: CGFloat = 10
    private static let sectionBottomPadding: CGFloat = 4
    private static let rowHPadding: CGFloat = 14
    private static let rowVPadding: CGFloat = 11
    private static let rowGap: CGFloat = 2
    private static let rowBorderWidth: CGFloat = 1
    private static let primaryFontSize: CGFloat = 13
    private static let secondaryFontSize: CGFloat = 8
    private static let secondaryKerning: CGFloat = 1

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 0) {
                if !shopResults.isEmpty {
                    sectionLabel("SHOPS")
                    ForEach(shopResults) { shop in
                        row(primary: shop.name, secondary: shop.addressLine) {
                            onSelectShop(shop)
                        }
                    }
                }
                if !placeResults.isEmpty {
                    sectionLabel("LOCATIONS")
                    ForEach(placeResults) { place in
                        row(primary: place.text.text, secondary: nil) {
                            onSelectPlace(place)
                        }
                    }
                }
            }
        }
        .frame(maxHeight: Self.maxHeight)
        .background(Color.white)
        .overlay(alignment: .leading) {
            Rectangle().fill(Color.inkCol).frame(width: Self.borderWidth)
        }
        .overlay(alignment: .trailing) {
            Rectangle().fill(Color.inkCol).frame(width: Self.borderWidth)
        }
        .overlay(alignment: .bottom) {
            Rectangle().fill(Color.inkCol).frame(height: Self.borderWidth)
        }
    }

    private func sectionLabel(_ title: String) -> some View {
        Text(title)
            .font(.mono(Self.sectionFontSize))
            .kerning(Self.sectionKerning)
            .foregroundStyle(Color.grey)
            .padding(.horizontal, Self.sectionHPadding)
            .padding(.top, Self.sectionTopPadding)
            .padding(.bottom, Self.sectionBottomPadding)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color.paper2)
    }

    private func row(primary: String, secondary: String?, onTap: @escaping () -> Void) -> some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: Self.rowGap) {
                Text(primary)
                    .font(.special(Self.primaryFontSize))
                    .foregroundStyle(Color.inkCol)
                if let secondary {
                    Text(secondary)
                        .font(.mono(Self.secondaryFontSize))
                        .kerning(Self.secondaryKerning)
                        .foregroundStyle(Color.grey)
                }
            }
            .padding(.horizontal, Self.rowHPadding)
            .padding(.vertical, Self.rowVPadding)
            .frame(maxWidth: .infinity, alignment: .leading)
            .overlay(alignment: .bottom) {
                Rectangle().fill(Color.grey2).frame(height: Self.rowBorderWidth)
            }
        }
        .buttonStyle(.plain)
    }
}
