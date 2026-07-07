import SwiftUI

struct LocateButtonView: View {
    let action: () -> Void

    var body: some View {
        NicheButton(variant: .icon, action: action) {
            IconView(icon: .locate, size: IconSize.sm)
        }
    }
}
