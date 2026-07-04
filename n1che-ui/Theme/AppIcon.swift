// Every icon in the app, as SF Symbol names. Views render these through
// IconView — never as raw strings in Text — so swapping the icon set
// touches one file.
enum AppIcon: String {
    case info = "info.circle"
    case chevronRight = "chevron.right"
    case list = "list.bullet"
    case plus = "plus"
    case route = "point.topleft.down.to.point.bottomright.curvepath"
    case turnLeft = "arrow.turn.up.left"
    case turnRight = "arrow.turn.up.right"
    case uturnLeft = "arrow.uturn.left"
    case uturnRight = "arrow.uturn.right"
    case roundaboutLeft = "arrow.counterclockwise"
    case roundaboutRight = "arrow.clockwise"
    case straight = "arrow.up"
    case arrive = "mappin"
}
