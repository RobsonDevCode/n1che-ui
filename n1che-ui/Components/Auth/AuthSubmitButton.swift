import SwiftUI

struct AuthSubmitButton: View {
    let title: String
    var loading: Bool = false
    let action: () -> Void

    var body: some View {
        NicheButton(
            title,
            variant: .primary,
            loading: loading,
            cornerRadius: CornerRadius.soft,
            trailingIcon: .arrowRight,
            action: action
        )
    }
}
