import SwiftUI

enum PolaroidSize {
    case home
    case map

    var width: CGFloat {
        switch self {
        case .home: return 108
        case .map:  return 48
        }
    }

    var photoHeight: CGFloat {
        switch self {
        case .home: return 76
        case .map:  return 32
        }
    }

    var frameInset: CGFloat {
        switch self {
        case .home: return 7
        case .map:  return 3
        }
    }

    var captionHeight: CGFloat {
        switch self {
        case .home: return 32
        case .map:  return 13
        }
    }

    var initialFontSize: CGFloat {
        switch self {
        case .home: return 34
        case .map:  return 15
        }
    }

    var nameFontSize: CGFloat {
        switch self {
        case .home: return 9
        case .map:  return 5.5
        }
    }

    var scanLineCount: Int {
        switch self {
        case .home: return 7
        case .map:  return 4
        }
    }
}
