import Foundation

@MainActor
@Observable
final class NicheStore {
    private static let storageKey = "selectedNiche"

    var selectedNiche: String? = UserDefaults.standard.string(forKey: NicheStore.storageKey) {
        didSet { UserDefaults.standard.set(selectedNiche, forKey: Self.storageKey) }
    }
}
