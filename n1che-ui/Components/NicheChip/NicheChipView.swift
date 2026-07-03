import SwiftUI

struct NicheChipView: View {
    private static let fontSize: CGFloat  = 14
    private static let kerning: CGFloat   = 1.5
    private static let hPadding: CGFloat  = 10
    private static let vPadding: CGFloat  = 4
    private static let rotation: CGFloat  = -1

    let label: String
    let onPress: () -> Void

    var body: some View {
        Button(action: onPress) {
            Text("\(label.uppercased()) ▾")
                .font(.bebas(Self.fontSize))
                .kerning(Self.kerning)
                .foregroundStyle(Color.white)
                .padding(.horizontal, Self.hPadding)
                .padding(.vertical, Self.vPadding)
                .background(Color.pop)
        }
        .rotationEffect(.degrees(Self.rotation))
    }
}
