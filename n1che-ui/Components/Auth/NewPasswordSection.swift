import SwiftUI

struct NewPasswordSection: View {
    @Binding var password: String
    @Binding var confirmPassword: String
    var label: String = "Password"
    var confirmLabel: String = "Confirm Password"

    var body: some View {
        AuthPasswordField(label: label, value: $password, isNew: true)
        PasswordRequirementsView(password: password)
        AuthPasswordField(label: confirmLabel, value: $confirmPassword, isNew: true)
    }
}
