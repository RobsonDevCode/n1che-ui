import SwiftUI

struct RootView: View {
    @Environment(AppCoordinator.self) private var coordinator
    @Environment(AuthStore.self) private var authStore
    @State private var session = AuthSessionViewModel()

    var body: some View {
        @Bindable var coordinator = coordinator
        NavigationStack(path: $coordinator.path) {
            SplashView()
                .toolbar(.hidden, for: .navigationBar)
                .navigationDestination(for: Route.self) { route in
                    destination(for: route)
                        .toolbar(.hidden, for: .navigationBar)
                }
        }
        .task { await session.restoreSession(into: authStore) }
    }

    @ViewBuilder
    private func destination(for route: Route) -> some View {
        switch route {
        case .nichePicker:
            NichePickerView()
        case .map:
            MapView()
        case .logIn:
            LoginView()
        case .signUp:
            SignUpView()
        }
    }
}
