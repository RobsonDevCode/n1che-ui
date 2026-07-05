import Observation

@MainActor
@Observable
final class AppCoordinator {
    var path: [Route] = []

    func push(_ route: Route) {
        path.append(route)
    }

    func pop() {
        _ = path.popLast()
    }

    func replaceTop(_ route: Route) {
        if path.isEmpty {
            path.append(route)
        } else {
            path[path.count - 1] = route
        }
    }

    func popToRoot() {
        path.removeAll()
    }
}
