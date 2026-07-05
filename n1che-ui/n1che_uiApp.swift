import SwiftUI

@main
struct n1che_uiApp: App {
    @State private var authStore   = AuthStore()

    init() {
        AmplifyConfigurator.configure()
    }
    @State private var nicheStore  = NicheStore()
    @State private var shopStore   = ShopStore()
    @State private var coordinator = AppCoordinator()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(authStore)
                .environment(nicheStore)
                .environment(shopStore)
                .environment(coordinator)
        }
    }
}
