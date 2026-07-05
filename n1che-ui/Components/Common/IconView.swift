import SwiftUI

struct IconView: View {
    let icon: AppIcon
    var size: CGFloat = IconSize.md
    var color: Color = .inkCol
    // Bold default — thin strokes look out of place against the heavy ink borders
    var weight: Font.Weight = .bold

    var body: some View {
        Image(systemName: icon.rawValue)
            .font(.system(size: size, weight: weight))
            .foregroundStyle(color)
    }
}
