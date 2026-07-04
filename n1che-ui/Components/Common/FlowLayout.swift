import SwiftUI

// Wrapping horizontal layout — rows break when the next item exceeds the
// available width. Items are vertically centred within their row.
struct FlowLayout: Layout {
    var spacing: CGFloat = 5

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let rows = rows(for: subviews, maxWidth: proposal.width ?? .infinity)
        let height = rows.map(\.height).reduce(0, +) + spacing * CGFloat(max(0, rows.count - 1))
        let width = proposal.width ?? rows.map(\.width).max() ?? 0
        return CGSize(width: width, height: height)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var index = 0
        var y = bounds.minY
        for row in rows(for: subviews, maxWidth: bounds.width) {
            var x = bounds.minX
            for size in row.sizes {
                subviews[index].place(
                    at: CGPoint(x: x, y: y + (row.height - size.height) / 2),
                    proposal: .unspecified
                )
                x += size.width + spacing
                index += 1
            }
            y += row.height + spacing
        }
    }

    private struct Row {
        var sizes: [CGSize] = []
        var width: CGFloat = 0
        var height: CGFloat = 0
    }

    private func rows(for subviews: Subviews, maxWidth: CGFloat) -> [Row] {
        var rows: [Row] = [Row()]
        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            var row = rows[rows.count - 1]
            let projectedWidth = row.sizes.isEmpty ? size.width : row.width + spacing + size.width
            if !row.sizes.isEmpty && projectedWidth > maxWidth {
                rows.append(Row(sizes: [size], width: size.width, height: size.height))
            } else {
                row.sizes.append(size)
                row.width = projectedWidth
                row.height = max(row.height, size.height)
                rows[rows.count - 1] = row
            }
        }
        return rows
    }
}
