// Raw palette values — no SwiftUI import so models can reference Palette.count safely.
// Colors.swift maps these to Color objects.
enum Palette {
    static let polHexValues: [String] = [
        "#9B8E7E", "#7A9080", "#8E8A7C", "#9A8070",
        "#768898", "#9E9060", "#887A8A", "#7C9080",
    ]
    static let pinHexValues: [String] = [
        "#AE1C14", "#1A4E8C", "#1A6330", "#7A4010",
    ]
    static let popHex = "#000000"
    static var polCount: Int { polHexValues.count }
    static var pinCount: Int { pinHexValues.count }
}
