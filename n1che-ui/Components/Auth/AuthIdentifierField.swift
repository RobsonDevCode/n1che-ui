import SwiftUI

struct AuthIdentifierField: View {
    @Binding var value: String

    var body: some View {
        InputBoxView(
            label: "Email or Username",
            value: $value,
            placeholder: "your@email.com or yourhandle",
            keyboard: .emailAddress,
            contentType: .username
        )
    }
}
