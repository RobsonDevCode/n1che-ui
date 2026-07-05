import SwiftUI

struct PasswordRequirementsView: View {
    let password: String

    private struct Requirement {
        let label: String
        let isMet: (String) -> Bool
    }

    private static let requirements: [Requirement] = [
        Requirement(label: "8+ characters", isMet: { $0.count >= 8 }),
        Requirement(label: "Uppercase letter", isMet: { $0.contains(where: \.isUppercase) }),
        Requirement(label: "Lowercase letter", isMet: { $0.contains(where: \.isLowercase) }),
        Requirement(label: "Number", isMet: { $0.contains(where: \.isNumber) }),
        Requirement(label: "Special character", isMet: { $0.contains { !$0.isLetter && !$0.isNumber } }),
    ]

    private static let rowSpacing: CGFloat = 4
    private static let indicatorGap: CGFloat = 5
    private static let indicatorWidth: CGFloat = 10
    private static let checkSize: CGFloat = 9
    private static let dotSize: CGFloat = 3
    private static let labelSize: CGFloat = 10
    private static let labelKerning: CGFloat = 0.5
    private static let topGap: CGFloat = 4
    private static let bottomGap: CGFloat = 8

    var body: some View {
        LazyVGrid(
            columns: [GridItem(.flexible(), alignment: .leading), GridItem(.flexible(), alignment: .leading)],
            alignment: .leading,
            spacing: Self.rowSpacing
        ) {
            ForEach(Self.requirements, id: \.label) { requirement in
                let met = !password.isEmpty && requirement.isMet(password)
                HStack(spacing: Self.indicatorGap) {
                    Group {
                        if met {
                            IconView(icon: .check, size: Self.checkSize)
                        } else {
                            Circle()
                                .fill(Color.grey)
                                .frame(width: Self.dotSize, height: Self.dotSize)
                        }
                    }
                    .frame(width: Self.indicatorWidth)
                    Text(requirement.label.uppercased())
                        .font(.mono(Self.labelSize))
                        .kerning(Self.labelKerning)
                        .foregroundStyle(met ? Color.inkCol : .grey)
                }
            }
        }
        .padding(.top, Self.topGap)
        .padding(.bottom, Self.bottomGap)
    }
}
