import SwiftUI

struct PolaroidView: View {
    let shop: ShopDisplay
    let size: PolaroidSize
    var selected: Bool = false

    private static let borderWidth: CGFloat = 1
    private static let initialOpacity: Double = 0.16
    private static let halftoneOpacity: Double = 0.13
    private static let halftoneDotRadius: CGFloat = 0.8
    private static let halftoneSpacing: CGFloat = 4
    private static let vignetteOpacity: Double = 0.20
    private static let scanLineOpacity: Double = 0.07
    private static let scanLineHeight: CGFloat = 1
    private static let captionGap: CGFloat = 1
    private static let captionHPadding: CGFloat = 4
    private static let addressFontSize: CGFloat = 6.5
    private static let selectedDotSize: CGFloat = 4

    private static let mapShadowOpacity: Double = 0.65
    private static let homeShadowOpacity: Double = 0.45
    private static let homeShadowOpacitySelected: Double = 0.8
    private static let mapShadowRadius: CGFloat = 6
    private static let homeShadowRadius: CGFloat = 22
    private static let mapShadowOffset = CGSize(width: 1, height: 3)
    private static let homeShadowOffset = CGSize(width: 3, height: 8)

    private var bg: Color { Color.polPalette[shop.palIdx % Color.polPalette.count] }
    private var initial: String { String(shop.name.prefix(1)).uppercased() }

    private var shadowOpacity: Double {
        size == .map ? Self.mapShadowOpacity : (selected ? Self.homeShadowOpacitySelected : Self.homeShadowOpacity)
    }
    private var shadowRadius: CGFloat { size == .map ? Self.mapShadowRadius : Self.homeShadowRadius }
    private var shadowOffset: CGSize { size == .map ? Self.mapShadowOffset : Self.homeShadowOffset }

    var body: some View {
        VStack(spacing: 0) {
            photoArea
                .padding(.top, size.frameInset)
                .padding(.horizontal, size.frameInset)
            captionArea
                .frame(height: size.captionHeight)
        }
        .frame(width: size.width)
        .background(Color.cardBg)
        .overlay {
            if size == .map {
                Rectangle().stroke(Color.inkCol, lineWidth: Self.borderWidth)
            }
        }
        // Flatten before shadowing so glyphs don't cast individual shadows
        .compositingGroup()
        .shadow(
            color: .black.opacity(shadowOpacity),
            radius: shadowRadius,
            x: shadowOffset.width,
            y: shadowOffset.height
        )
    }

    private var photoArea: some View {
        ZStack {
            bg
            Text(initial)
                .font(.bebas(size.initialFontSize))
                .foregroundStyle(Color.white.opacity(Self.initialOpacity))
            if let photoUrl = shop.photoUrl, let url = URL(string: photoUrl) {
                AsyncImage(url: url) { image in
                    image
                        .resizable()
                        .scaledToFill()
                        .frame(width: size.photoWidth, height: size.photoHeight)
                        .clipped()
                } placeholder: {
                    Color.clear
                }
            }
            HalftonePatternView(
                dotColor: .white.opacity(Self.halftoneOpacity),
                dotRadius: Self.halftoneDotRadius,
                spacing: Self.halftoneSpacing
            )
            LinearGradient(
                colors: [.clear, .black.opacity(Self.vignetteOpacity)],
                startPoint: .top,
                endPoint: .bottom
            )
            .allowsHitTesting(false)
            scanLines
        }
        .frame(height: size.photoHeight)
        .clipped()
    }

    private var scanLines: some View {
        let count = size.scanLineCount
        return Canvas { context, canvasSize in
            for i in 0..<count {
                let y = (CGFloat(i) / CGFloat(count)) * canvasSize.height
                context.fill(
                    Path(CGRect(x: 0, y: y, width: canvasSize.width, height: Self.scanLineHeight)),
                    with: .color(.white.opacity(Self.scanLineOpacity))
                )
            }
        }
        .allowsHitTesting(false)
    }

    private var captionArea: some View {
        VStack(spacing: Self.captionGap) {
            Text(shop.name)
                .font(.special(size.nameFontSize))
                .foregroundStyle(Color.inkCol)
                .lineLimit(1)
                .multilineTextAlignment(.center)
            if size == .home {
                Text(shop.address.components(separatedBy: ",").first ?? "")
                    .font(.mono(Self.addressFontSize))
                    .foregroundStyle(Color.grey)
                    .lineLimit(1)
                    .multilineTextAlignment(.center)
            }
            if size == .map && selected {
                Circle()
                    .fill(Color.pop)
                    .frame(width: Self.selectedDotSize, height: Self.selectedDotSize)
            }
        }
        .padding(.horizontal, Self.captionHPadding)
        .frame(maxWidth: .infinity)
        .background(Color.cardBg)
    }
}
