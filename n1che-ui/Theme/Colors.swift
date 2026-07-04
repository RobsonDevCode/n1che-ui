import SwiftUI

extension Color {
    static let paper  = Color(hex: "#F0EDE6")
    static let paper2 = Color(hex: "#E6E2D9")
    static let inkCol = Color(hex: "#111111")
    static let ink2   = Color(hex: "#333333")
    static let grey   = Color(hex: "#8A8680")
    static let grey2  = Color(hex: "#C8C4BC")
    static let pop    = Color(hex: "#000000")

    static let polPalette: [Color] = Palette.polHexValues.map { Color(hex: $0) }
    static let pinColors: [Color]  = Palette.pinHexValues.map { Color(hex: $0) }

    static let openGreen = Color(hex: "#4CAF50")
    static let cardBg    = Color(hex: "#F8F7F3")
    static let tackShaft = Color(hex: "#5A5A5A").opacity(0.7)

    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3:
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 255, 255, 255)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
