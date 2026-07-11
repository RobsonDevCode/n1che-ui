import Foundation

enum StringUtils {
    private static let maxShortNameLength = 10
    private static let truncatedNameLength = 9
    private static let metersPerMile: Double = 1609.344
    private static let feetPerMile: Double = 5280
    private static let feetThresholdMiles: Double = 0.1
    private static let minutesPerHour = 60

    static func formatMiles(_ value: Double) -> String {
        String(format: "%.1fmi", value)
    }

    // "0.4 mi", or "480 ft" under a tenth of a mile
    static func formatRouteDistance(meters: Double) -> String {
        guard meters.isFinite else { return "" }
        let miles = meters / metersPerMile
        if miles < feetThresholdMiles {
            return "\(Int((miles * feetPerMile).rounded())) ft"
        }
        return String(format: "%.1f mi", miles)
    }

    // "45m", or "1h 20m" once past an hour
    static func formatRouteTime(minutes: Int) -> String {
        let hours = minutes / minutesPerHour
        let mins = minutes % minutesPerHour
        return hours > 0 ? "\(hours)h \(mins)m" : "\(mins)m"
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
