import SwiftUI

struct AuthPasswordField: View {
    let label: String
    @Binding var value: String
    // New-password fields get the .newPassword content type so iOS
    // offers to generate a strong password instead of autofilling
    var isNew: Bool = false

    var body: some View {
        InputBoxView(
            label: label,
            value: $value,
            placeholder: "••••••••",
            isSecure: true,
            contentType: isNew ? .newPassword : .password
        )
    }
}
