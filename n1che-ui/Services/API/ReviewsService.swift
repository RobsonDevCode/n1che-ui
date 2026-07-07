import Foundation

// TODO: inject APIClient and call GET/POST /shops/:id/reviews once the backend exists.
// Method signatures are final — only the bodies change when networking lands.
final class ReviewsService {
    func fetchReviews(shopId: String) async throws -> [Review] {
        MockReviewData.reviews(shopId: shopId)
    }

    func submitReview(shopId: String, user: String, text: String) async throws -> Review {
        Review(
            id: UUID().uuidString,
            shopId: shopId,
            user: user,
            date: DateUtils.monthYear(.now),
            text: text
        )
    }
}
