import Foundation

enum DateUtils {
    private static let iso8601 = ISO8601DateFormatter()

    private static let monthYearFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMM yyyy"
        return formatter
    }()

    // "Jul 2026"
    static func monthYear(_ date: Date) -> String {
        monthYearFormatter.string(from: date)
    }

    static func parseISO8601(_ value: String) -> Date? {
        iso8601.date(from: value)
    }

    // "7pm", or "7:30pm" when the time isn't on the hour
    static func shortTime(_ date: Date) -> String {
        let parts = Calendar.current.dateComponents([.hour, .minute], from: date)
        guard let hour = parts.hour, let minute = parts.minute else { return "" }
        let suffix = hour >= 12 ? "pm" : "am"
        let hour12 = hour % 12 == 0 ? 12 : hour % 12
        guard minute != 0 else { return "\(hour12)\(suffix)" }
        return String(format: "%d:%02d%@", hour12, minute, suffix)
    }
}
