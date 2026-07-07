// TODO: delete once ReviewsService calls the real backend.
enum MockReviewData {
    static func reviews(shopId: String) -> [Review] {
        [
            Review(
                id: "1",
                shopId: shopId,
                user: "lucywears",
                date: "Mar 2026",
                text: "Absolute gem. Found a perfect leather jacket for £35 — staff know their archive inside out."
            ),
            Review(
                id: "2",
                shopId: shopId,
                user: "thriftfiend",
                date: "Feb 2026",
                text: "Great selection, can get crowded on weekends. Worth the trip for the prices alone."
            ),
            Review(
                id: "3",
                shopId: shopId,
                user: "voidwalker",
                date: "Jan 2026",
                text: "Asked about the provenance of a jacket and got a full history. This is what niche shopping is about."
            ),
        ]
    }
}
