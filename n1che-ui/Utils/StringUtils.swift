import Foundation

enum StringUtils {
    private static let maxShortNameLength = 10
    private static let truncatedNameLength = 9

    static func formatMiles(_ value: Double) -> String {
        String(format: "%.1fmi", value)
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
