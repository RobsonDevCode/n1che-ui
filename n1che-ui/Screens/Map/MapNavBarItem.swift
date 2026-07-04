struct MapNavBarItem: Identifiable {
    let id: String
    let icon: AppIcon
    var isActive: Bool = false
    let action: () -> Void
}
