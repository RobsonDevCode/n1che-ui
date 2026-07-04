import Foundation

// Operates on hex strings rather than Color, which has no channel access.
enum ColorAdjust {
    static func lighten(_ hex: String, by amount: Int) -> String {
        adjust(hex, by: amount)
    }

    static func darken(_ hex: String, by amount: Int) -> String {
        adjust(hex, by: -amount)
    }

    private static func adjust(_ hex: String, by amount: Int) -> String {
        let cleaned = hex.replacingOccurrences(of: "#", with: "")
        guard let n = Int(cleaned, radix: 16) else { return hex }
        let r = min(255, max(0, ((n >> 16) & 0xFF) + amount))
        let g = min(255, max(0, ((n >> 8) & 0xFF) + amount))
        let b = min(255, max(0, (n & 0xFF) + amount))
        return String(format: "#%02X%02X%02X", r, g, b)
    }
}
