import SwiftUI

extension View {
    // Hairline separator along the bottom edge, used by list rows and bars
    func bottomBorder(_ color: Color = .grey2, height: CGFloat = 1) -> some View {
        overlay(alignment: .bottom) {
            Rectangle()
                .fill(color)
                .frame(height: height)
        }
    }
}
