import Foundation

enum StringUtils {
    private static let maxShortNameLength = 10
    private static let truncatedNameLength = 9

    static func formatMiles(_ value: Double) -> String {
        String(format: "%.1fmi", value)
    }

    static func formatMeters(_ meters: Double) -> String {
        guard meters.isFinite else { return "" }
        if meters >= 1000 {
            return String(format: "%.1f KM", meters / 1000)
        }
        return "\(Int(meters.rounded())) M"
    }

    static func truncated(_ value: String, maxLength: Int) -> String {
        value.count > maxLength ? String(value.prefix(maxLength)) : value
    }

    static func isEmailAddress(_ value: String) -> Bool {
        value.range(of: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", options: .regularExpression) != nil
    }

    // First word of a name, truncated with a trailing "." when too long
    static func shortName(_ name: String) -> String {
        let first = name
            .split(whereSeparator: { $0.isWhitespace || $0 == "&" })
            .first
            .map(String.init) ?? name
        if first.count <= maxShortNameLength { return first }
        return String(first.prefix(truncatedNameLength)) + "."
    }
}
