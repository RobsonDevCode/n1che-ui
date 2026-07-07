import Foundation
import Observation

@MainActor
@Observable
final class ShopPanelViewModel {
    var voted = false
    var saved = false
    var reviews: [Review] = []
    var showReviewForm = false
    var reviewText = ""

    private let reviewsService: ReviewsService

    init(reviewsService: ReviewsService = ReviewsService()) {
        self.reviewsService = reviewsService
    }

    var canSubmitReview: Bool {
        !reviewText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    func loadReviews(shopId: String) async {
        reviews = (try? await reviewsService.fetchReviews(shopId: shopId)) ?? []
    }

    // TODO: wire to POST /shops/:id/vote once the backend exists
    func saveVote() {
        voted.toggle()
    }

    // TODO: wire to POST /shops/:id/save once the backend exists
    func saveShop() {
        saved.toggle()
    }

    func submitReview(shopId: String, username: String) async {
        let text = reviewText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty else { return }
        guard let review = try? await reviewsService.submitReview(shopId: shopId, user: username, text: text) else { return }
        reviews.append(review)
        reviewText = ""
        showReviewForm = false
    }

    func cancelReview() {
        reviewText = ""
        showReviewForm = false
    }
}
