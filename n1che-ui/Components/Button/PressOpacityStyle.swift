import SwiftUI

struct PressOpacityStyle: ButtonStyle {
    let pressedOpacity: Double

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .opacity(configuration.isPressed ? pressedOpacity : 1.0)
    }
}
