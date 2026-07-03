import SwiftUI

enum AppFont {
    static let bebas      = "BebasNeue-Regular"
    static let special    = "SpecialElite-Regular"
    static let oswald     = "Oswald-Regular"
    static let fellItalic = "IMFellEnglish-Italic"
    static let mono       = "DMMono-Regular"
}

enum FontSize {
    static let display: CGFloat = 86
    static let h1: CGFloat      = 46
    static let h2: CGFloat      = 28
    static let h3: CGFloat      = 22
    static let body: CGFloat    = 16
    static let small: CGFloat   = 13
    static let caption: CGFloat = 11
    static let label: CGFloat   = 9
    static let micro: CGFloat   = 7
}

extension Font {
    static func bebas(_ size: CGFloat) -> Font {
        .custom(AppFont.bebas, size: size)
    }
    static func special(_ size: CGFloat) -> Font {
        .custom(AppFont.special, size: size)
    }
    static func oswald(_ size: CGFloat) -> Font {
        .custom(AppFont.oswald, size: size)
    }
    static func fellItalic(_ size: CGFloat) -> Font {
        .custom(AppFont.fellItalic, size: size)
    }
    static func mono(_ size: CGFloat) -> Font {
        .custom(AppFont.mono, size: size)
    }
}
