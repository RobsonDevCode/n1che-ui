import SwiftUI

@main
struct n1che_uiApp: App {
    @State private var authStore  = AuthStore()
    @State private var nicheStore = NicheStore()
    @State private var shopStore  = ShopStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(authStore)
                .environment(nicheStore)
                .environment(shopStore)
        }
    }
}
