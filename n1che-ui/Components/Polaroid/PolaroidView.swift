import SwiftUI

struct PolaroidView: View {
    let shop: ShopDisplay
    let size: PolaroidSize
    let index: Int
    var selected: Bool = false

    private var bg: Color { Color.polPalette[index % Color.polPalette.count] }
    private var initial: String { String(shop.name.prefix(1)).uppercased() }

    private var shadowOpacity: Double { size == .map ? 0.65 : (selected ? 0.8 : 0.45) }
    private var shadowRadius: CGFloat  { size == .map ? 6 : 22 }
    private var shadowOffset: CGSize   { size == .map ? CGSize(width: 1, height: 3) : CGSize(width: 3, height: 8) }

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
                Rectangle().stroke(Color.inkCol, lineWidth: 1)
            }
        }
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
                .foregroundStyle(Color.white.opacity(0.16))
            HalftonePatternView(dotColor: .white.opacity(0.13), dotRadius: 0.8, spacing: 4)
            LinearGradient(colors: [.clear, .black.opacity(0.20)], startPoint: .top, endPoint: .bottom)
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
                    Path(CGRect(x: 0, y: y, width: canvasSize.width, height: 1)),
                    with: .color(.white.opacity(0.07))
                )
            }
        }
        .allowsHitTesting(false)
    }

    private var captionArea: some View {
        VStack(spacing: 1) {
            Text(shop.name)
                .font(.special(size.nameFontSize))
                .foregroundStyle(Color.inkCol)
                .lineLimit(1)
                .multilineTextAlignment(.center)
            if size == .home {
                Text(shop.address.components(separatedBy: ",").first ?? "")
                    .font(.mono(6.5))
                    .foregroundStyle(Color.grey)
                    .lineLimit(1)
                    .multilineTextAlignment(.center)
            }
            if size == .map && selected {
                Circle()
                    .fill(Color.pop)
                    .frame(width: 4, height: 4)
            }
        }
        .padding(.horizontal, 4)
        .frame(maxWidth: .infinity)
        .background(Color.cardBg)
    }
}
