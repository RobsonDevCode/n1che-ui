import Combine
import SwiftUI

struct MapView: View {
    @Environment(NicheStore.self) private var nicheStore
    @Environment(AppCoordinator.self) private var coordinator
    @State private var viewModel = MapViewModel()
    @State private var locationViewModel = LocationViewModel()
    @State private var keyboardHeight: CGFloat = 0
    @FocusState private var searchFocused: Bool

    private static let headerHPadding: CGFloat = 16
    private static let headerVPadding: CGFloat = 12
    private static let headerGap: CGFloat = 12
    private static let titleFontSize: CGFloat = 28
    private static let backIconSize: CGFloat = 20
    private static let backIconOpacity: Double = 0.6
    private static let chipPadding: CGFloat = 14
    // The map runs under the panel slot so the panel's rounded corners
    // overlap map instead of paper
    private static let mapBleed: CGFloat = 32
    private static let mapAnimDuration: TimeInterval = 0.3
    private static let keyboardMinMapHeight: CGFloat = 60
    private static let keyboardMapOverlap: CGFloat = 80
    // Unselected search-result pins fade back but stay visible while adding a shop
    private static let addShopDimmedMarkerAlpha: CGFloat = 0.3

    private var nicheLabel: String {
        Niche.all.first { $0.id == nicheStore.selectedNiche }?.label
            ?? nicheStore.selectedNiche
            ?? "Shops"
    }

    var body: some View {
        GeometryReader { geo in
            let fullHeight = geo.size.height + geo.safeAreaInsets.top + geo.safeAreaInsets.bottom
            let baseMapHeight = fullHeight * viewModel.mode.mapHeightRatio
            // Keyboard over the shop panel steals map height so the review
            // form stays visible
            let mapHeight = viewModel.mode == .shop && keyboardHeight > 0
                ? max(Self.keyboardMinMapHeight, baseMapHeight - keyboardHeight + Self.keyboardMapOverlap)
                : baseMapHeight
            let isBrowse = viewModel.mode == .browse
            // Browse and add-shop search fill the slot with map + overlaid nav bar
            let showsNavBar = isBrowse || viewModel.mode == .addShop

            VStack(spacing: 0) {
                InkHeaderView { header }
                if viewModel.mode.showsSearchBar {
                    if viewModel.mode.isAddingShop {
                        addShopSearchBar
                    } else {
                        searchBar
                    }
                }
                ZStack(alignment: .top) {
                    Group {
                        if locationViewModel.isLoading && locationViewModel.coordinate == nil {
                            Color.paper2
                        } else {
                            MapKitView(
                                shops: viewModel.markers,
                                selectedShopId: viewModel.markerSelectionId,
                                cameraCommand: viewModel.cameraCommand,
                                initialRegion: MapViewModel.initialRegion(
                                    for: nicheStore.selectedNiche,
                                    userCoordinate: locationViewModel.coordinate
                                ),
                                isInteractive: viewModel.mode != .shop,
                                dimmedMarkerAlpha: viewModel.mode.isAddingShop ? Self.addShopDimmedMarkerAlpha : 0,
                                onSelect: { id in
                                    searchFocused = false
                                    viewModel.markerTapped(id: id)
                                },
                                onRegionChange: { viewModel.regionDidChange($0) }
                            )
                        }
                    }
                    // Browse & add-shop search: the map fills the slot and the
                    // nav bar overlays it. Panel modes: fixed height per mode ratio.
                    .frame(height: showsNavBar ? nil : mapHeight + Self.mapBleed)

                    VStack(spacing: 0) {
                        Color.clear
                            .frame(height: showsNavBar ? nil : mapHeight)
                            .frame(maxHeight: showsNavBar ? .infinity : nil)
                            .overlay(alignment: .bottomLeading) {
                                LocationChipView(label: locationViewModel.label)
                                    .padding(Self.chipPadding)
                                    .allowsHitTesting(false)
                            }
                            .overlay(alignment: .bottomTrailing) {
                                if isBrowse && locationViewModel.coordinate != nil {
                                    LocateButtonView { viewModel.recenterOnUser() }
                                        .padding(Self.chipPadding)
                                }
                            }
                        if showsNavBar {
                            MapNavBarView(items: navBarItems, bottomInset: geo.safeAreaInsets.bottom)
                        } else {
                            panelSlot(bottomInset: geo.safeAreaInsets.bottom)
                                .frame(maxHeight: .infinity)
                        }
                    }

                    if viewModel.showsDropdown {
                        searchDropdown
                    }
                }
                .frame(maxHeight: .infinity, alignment: .top)
                .clipped()
                .animation(.easeInOut(duration: Self.mapAnimDuration), value: viewModel.mode)
                .animation(.easeInOut(duration: Self.mapAnimDuration), value: keyboardHeight)
            }
            .ignoresSafeArea(.container, edges: .bottom)
        }
        .background(Color.paper)
        .onAppear { viewModel.configure(niche: nicheStore.selectedNiche) }
        .onChange(of: locationViewModel.coordinate) { _, coordinate in
            if let coordinate {
                viewModel.locationDidResolve(coordinate)
            }
        }
        .onReceive(NotificationCenter.default.publisher(for: UIResponder.keyboardWillShowNotification)) { note in
            guard let frame = note.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? CGRect else { return }
            keyboardHeight = frame.height
        }
        .onReceive(NotificationCenter.default.publisher(for: UIResponder.keyboardWillHideNotification)) { _ in
            keyboardHeight = 0
        }
    }

    private var searchBar: some View {
        SearchBarView(
            placeholder: "Search shops or locations…",
            value: $viewModel.searchQuery,
            onSubmit: { viewModel.showPlace(named: $0) }
        )
        .focused($searchFocused)
    }

    private var addShopSearchBar: some View {
        VStack(spacing: 0) {
            SearchBarView(
                placeholder: "Search shop name…",
                value: $viewModel.addShopQuery,
                loading: viewModel.isSearchingPlaces,
                onClear: { viewModel.addShopQuery = "" }
            )
            .focused($searchFocused)
            if viewModel.addShopQuery.isEmpty {
                TooltipView(text: "Search for a shop by name, then tap the pin to add it")
            }
        }
    }

    private var searchDropdown: some View {
        SearchDropdownView(
            shopResults: viewModel.shopSuggestions,
            placeResults: viewModel.placePredictions,
            onSelectShop: { shop in
                searchFocused = false
                viewModel.clearSearch()
                viewModel.selectShop(id: shop.id)
            },
            onSelectPlace: { place in
                searchFocused = false
                viewModel.showPlace(named: place.text.text)
            }
        )
    }

    private var header: some View {
        let addingShop = viewModel.mode.isAddingShop
        return HStack(spacing: Self.headerGap) {
            Button(action: addingShop ? { viewModel.exitAddShop() } : coordinator.pop) {
                IconView(icon: .arrowLeft, size: Self.backIconSize, color: .white.opacity(Self.backIconOpacity))
            }
            HeaderTitleView(text: addingShop ? "ADD SHOP" : "NICHE", size: Self.titleFontSize)
            Spacer()
            if !addingShop {
                NicheChipView(label: nicheLabel) {
                    coordinator.replaceTop(.nichePicker)
                }
            }
        }
        .padding(.horizontal, Self.headerHPadding)
        .padding(.vertical, Self.headerVPadding)
    }

    @ViewBuilder
    private func panelSlot(bottomInset: CGFloat) -> some View {
        if let shop = viewModel.selectedShop, viewModel.mode == .shop {
            ShopPanel(
                shop: shop,
                bottomInset: bottomInset,
                onBack: { viewModel.deselectShop() },
                onDirections: { _ in } // TODO: direct route once routing lands
            )
            .id(shop.id)
        } else if viewModel.mode == .list {
            ShopListPanel(
                shops: viewModel.shops,
                nicheLabel: nicheLabel,
                bottomInset: bottomInset,
                onSelectShop: { viewModel.selectShop(id: $0.id) },
                onBack: { viewModel.hideList() }
            )
        } else if let place = viewModel.selectedPlace, viewModel.mode == .addShopDetail {
            AddShopPanel(
                place: place,
                submitting: viewModel.isSubmittingShop,
                bottomInset: bottomInset,
                onSubmit: { Task { await viewModel.submitShop() } },
                onBack: { viewModel.deselectPlace() }
            )
            .id(place.id)
        }
    }

    private var navBarItems: [MapNavBarItem] {
        if viewModel.mode.isAddingShop {
            return [
                MapNavBarItem(id: "map", icon: .map, isActive: true, action: { viewModel.exitAddShop() }),
                MapNavBarItem(id: "addShop", icon: .plus, action: {}),
            ]
        }
        return [
            MapNavBarItem(id: "list", icon: .list, action: { viewModel.showList() }),
            MapNavBarItem(id: "addShop", icon: .plus, action: { viewModel.enterAddShop() }),
            MapNavBarItem(id: "route", icon: .route, action: {}), // TODO: route picker
        ]
    }
}
