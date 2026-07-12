import Foundation
import MapKit
import Observation

@MainActor
@Observable
final class MapViewModel {
    var mode: MapMode = .browse
    var shops: [ShopDisplay] = []
    var selectedShop: ShopDisplay? = nil
    var cameraCommand: MapCameraCommand? = nil
    var searchQuery = "" {
        didSet {
            guard searchQuery != oldValue else { return }
            scheduleAutocomplete()
        }
    }
    var addShopQuery = "" {
        // A TextField re-commits its binding on focus loss (e.g. selecting a
        // result dismisses the keyboard), firing didSet with an unchanged value.
        // Only react to genuine edits, or that spurious set clears the selection.
        didSet {
            guard addShopQuery != oldValue else { return }
            scheduleAddShopSearch()
        }
    }
    var builderRouteName = ""
    private(set) var placePredictions: [PlacePrediction] = []
    private(set) var addShopResults: [ShopDisplay] = []
    private(set) var selectedPlace: ShopDisplay? = nil
    private(set) var isSearchingPlaces = false
    private(set) var isSubmittingShop = false
    private(set) var isLoading = false
    private(set) var activeRoute: RouteResponse? = nil
    // Builder preview geometry, drawn thinner than an active route
    private(set) var previewPolyline: [Coordinate] = []
    // The shops behind the active route's stops, in stop order
    private(set) var routeStops: [ShopDisplay] = []
    private(set) var isRouteLoading = false
    private(set) var routeErrorMessage: String? = nil
    private(set) var builderStops: [ShopDisplay] = []
    private(set) var builderPreviewRoute: RouteResponse? = nil
    private(set) var isBuilderPreviewLoading = false
    private(set) var builderRangeMessage: String? = nil

    // Full geometry of the active route, drawn on the map
    var routePolyline: [Coordinate] { activeRoute?.polyline ?? [] }

    var markers: [ShopDisplay] {
        if mode == .route { return routeStops }
        if mode == .routeBuilder {
            // Added stops stay pinned even after panning to a different area
            let shopIds = Set(shops.map(\.id))
            return shops + builderStops.filter { !shopIds.contains($0.id) }
        }
        return mode.isAddingShop ? addShopResults : shops
    }

    var markerSelectionIds: Set<String> {
        if mode == .routeBuilder { return Set(builderStops.map(\.id)) }
        if mode.isAddingShop { return selectedPlace.map { [$0.id] } ?? [] }
        return selectedShop.map { [$0.id] } ?? []
    }

    var shopSuggestions: [ShopDisplay] {
        guard searchQuery.count >= Self.minSearchLength else { return [] }
        return shops.filter { $0.name.localizedCaseInsensitiveContains(searchQuery) }
    }

    var showsDropdown: Bool {
        searchQuery.count >= Self.minSearchLength
            && !(shopSuggestions.isEmpty && placePredictions.isEmpty)
    }

    @ObservationIgnored private var niche = MapViewModel.fallbackNiche
    @ObservationIgnored private var visibleRegion: MKCoordinateRegion? = nil
    @ObservationIgnored private var fetchTask: Task<Void, Never>? = nil
    @ObservationIgnored private var lastFetchKey = ""
    @ObservationIgnored private var autocompleteTask: Task<Void, Never>? = nil
    @ObservationIgnored private var addShopSearchTask: Task<Void, Never>? = nil
    @ObservationIgnored private var routeTask: Task<Void, Never>? = nil
    @ObservationIgnored private var builderPreviewTask: Task<Void, Never>? = nil
    @ObservationIgnored private var rangeMessageTask: Task<Void, Never>? = nil
    @ObservationIgnored private var userCoordinate: Coordinate? = nil

    private static let fallbackNiche = "goth"
    static let maxBuilderStops = 15
    static let minBuilderStops = 2
    // Walking routes: each new stop must be within reach of the previous one
    static let maxBuilderStopGapKm: Double = 2
    private static let rangeMessageDuration = Duration.seconds(3)
    private static let regionDebounce = Duration.milliseconds(400)
    private static let autocompleteDebounce = Duration.milliseconds(400)
    private static let builderPreviewDebounce = Duration.milliseconds(600)
    private static let minSearchLength = 2
    private static let placeLatitudeDelta: Double = 0.06
    private static let recenterAnimDuration: TimeInterval = 0.6
    // Round fetch coordinates to a ~110m grid so minor panning doesn't refetch
    private static let gridPrecision: Double = 1_000
    private static let maxResults = 20
    // Breathing room around the enclosing region when fitting to search results
    private static let fitPaddingFactor: Double = 1.4
    private static let metersPerDegreeLatitude: Double = 111_320
    private static let minSearchRadiusMeters: Double = 200
    private static let maxSearchRadiusMeters: Double = 50_000
    private static let photoMaxWidthPx = 400

    private static let defaultRegion = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 51.5213, longitude: -0.0728),
        span: MKCoordinateSpan(latitudeDelta: 0.012, longitudeDelta: 0.008)
    )
    private static let portobelloRegion = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 51.5128, longitude: -0.2000),
        span: MKCoordinateSpan(latitudeDelta: 0.010, longitudeDelta: 0.007)
    )
    private static let shopZoomSpan = MKCoordinateSpan(latitudeDelta: 0.004, longitudeDelta: 0.003)
    private static let browseSpan = MKCoordinateSpan(latitudeDelta: 0.02, longitudeDelta: 0.02)
    private static let selectAnimDuration: TimeInterval = 0.4

    private let shopsService: ShopsService
    private let placesService: PlacesService
    private let geocodingService: GeocodingService
    private let routesService: RoutesService

    init(
        shopsService: ShopsService = ShopsService(),
        placesService: PlacesService = PlacesService(),
        geocodingService: GeocodingService = GeocodingService(),
        routesService: RoutesService = RoutesService()
    ) {
        self.shopsService = shopsService
        self.placesService = placesService
        self.geocodingService = geocodingService
        self.routesService = routesService
    }

    static func initialRegion(for niche: String?, userCoordinate: Coordinate?) -> MKCoordinateRegion {
        if let userCoordinate {
            return MKCoordinateRegion(
                center: CLLocationCoordinate2D(latitude: userCoordinate.latitude, longitude: userCoordinate.longitude),
                span: browseSpan
            )
        }
        return niche == "vintage" ? portobelloRegion : defaultRegion
    }

    func configure(niche: String?) {
        self.niche = niche ?? Self.fallbackNiche
    }

    func locationDidResolve(_ coordinate: Coordinate) {
        userCoordinate = coordinate
        shops = shops.map { shop in
            var updated = shop
            updated.distanceMi = distanceMiles(to: updated.shop)
            return updated
        }
    }

    // Freezes visibleRegion outside browse/list/builder so closing a panel
    // restores the viewport the user was browsing, not wherever the camera
    // zoomed to. The builder keeps fetching so routes can be built anywhere.
    func regionDidChange(_ region: MKCoordinateRegion) {
        guard mode == .browse || mode == .list || mode == .routeBuilder else { return }
        visibleRegion = region
        let key = fetchKey(for: region)
        guard key != lastFetchKey else { return }
        fetchTask?.cancel()
        fetchTask = Task {
            try? await Task.sleep(for: Self.regionDebounce)
            guard !Task.isCancelled else { return }
            lastFetchKey = key
            await fetchShops(around: region)
        }
    }

    func recenterOnUser() {
        guard let userCoordinate else { return }
        cameraCommand = MapCameraCommand(
            center: CLLocationCoordinate2D(latitude: userCoordinate.latitude, longitude: userCoordinate.longitude),
            span: Self.browseSpan,
            duration: Self.recenterAnimDuration
        )
    }

    func selectShop(id: String) {
        if selectedShop?.id == id {
            deselectShop()
            return
        }
        guard let shop = shops.first(where: { $0.id == id }) else { return }
        selectedShop = shop
        mode = .shop
        cameraCommand = MapCameraCommand(
            center: CLLocationCoordinate2D(latitude: shop.latitude, longitude: shop.longitude),
            span: Self.shopZoomSpan,
            duration: Self.selectAnimDuration
        )
    }

    func markerTapped(id: String) {
        if mode == .routeBuilder {
            selectBuilderStop(id: id)
        } else if mode.isAddingShop {
            selectPlace(id: id)
        } else {
            selectShop(id: id)
        }
    }

    func enterRouteBuilder() {
        selectedShop = nil
        mode = .routeBuilder
    }

    func exitRouteBuilder() {
        builderPreviewTask?.cancel()
        rangeMessageTask?.cancel()
        builderStops = []
        builderRouteName = ""
        builderPreviewRoute = nil
        isBuilderPreviewLoading = false
        builderRangeMessage = nil
        previewPolyline = []
        restoreBrowseCamera()
    }

    // Tap on a marker while building — adds the stop, or removes it when
    // it's already in the route
    func selectBuilderStop(id: String) {
        if builderStops.contains(where: { $0.id == id }) {
            removeBuilderStop(id: id)
            return
        }
        guard builderStops.count < Self.maxBuilderStops,
              let shop = shops.first(where: { $0.id == id }) else { return }
        guard isWithinBuilderRange(shop) else {
            showBuilderRangeMessage()
            return
        }
        builderStops.append(shop)
        refreshBuilderPreview()
    }

    // Markers beyond reach of the last stop — greyed out on the map
    var outOfRangeShopIds: Set<String> {
        guard mode == .routeBuilder, !builderStops.isEmpty else { return [] }
        let stopIds = Set(builderStops.map(\.id))
        return Set(
            shops
                .filter { !stopIds.contains($0.id) && !isWithinBuilderRange($0) }
                .map(\.id)
        )
    }

    private func isWithinBuilderRange(_ shop: ShopDisplay) -> Bool {
        guard let lastStop = builderStops.last else { return true }
        let gapKm = Geo.kilometers(
            from: Coordinate(latitude: lastStop.latitude, longitude: lastStop.longitude),
            to: Coordinate(latitude: shop.latitude, longitude: shop.longitude)
        )
        return gapKm <= Self.maxBuilderStopGapKm
    }

    private func showBuilderRangeMessage() {
        rangeMessageTask?.cancel()
        builderRangeMessage = "Too far from your last stop — keep stops within \(Int(Self.maxBuilderStopGapKm)) km."
        rangeMessageTask = Task {
            try? await Task.sleep(for: Self.rangeMessageDuration)
            guard !Task.isCancelled else { return }
            builderRangeMessage = nil
        }
    }

    func removeBuilderStop(id: String) {
        builderStops.removeAll { $0.id == id }
        refreshBuilderPreview()
    }

    // Straight lines between stops immediately, swapped for routed geometry
    // (plus distance/time) once the debounced compute lands
    private func refreshBuilderPreview() {
        builderPreviewTask?.cancel()
        builderPreviewRoute = nil
        guard builderStops.count >= Self.minBuilderStops else {
            previewPolyline = []
            isBuilderPreviewLoading = false
            return
        }
        previewPolyline = builderStops.map { Coordinate(latitude: $0.latitude, longitude: $0.longitude) }
        isBuilderPreviewLoading = true
        builderPreviewTask = Task {
            try? await Task.sleep(for: Self.builderPreviewDebounce)
            guard !Task.isCancelled else { return }
            // Built routes are open trails between the stops — never anchored
            // to the user's position
            let route = try? await routesService.computeRoute(
                stops: builderStops.map(RouteStop.init(shop:)),
                origin: nil,
                mode: .you,
                name: builderRouteName,
                tag: "CUSTOM",
                createdBy: "",
                userId: ""
            )
            guard !Task.isCancelled else { return }
            isBuilderPreviewLoading = false
            guard let route else { return }
            builderPreviewRoute = route
            previewPolyline = route.polyline
        }
    }

    func showList() {
        mode = .list
    }

    func enterAddShop() {
        selectedShop = nil
        mode = .addShop
    }

    func exitAddShop() {
        addShopSearchTask?.cancel()
        addShopQuery = ""
        selectedPlace = nil
        mode = .browse
        guard let region = visibleRegion else { return }
        cameraCommand = MapCameraCommand(
            center: region.center,
            span: region.span,
            duration: Self.selectAnimDuration
        )
    }

    func selectPlace(id: String) {
        guard selectedPlace?.id != id else { return }
        guard let place = addShopResults.first(where: { $0.id == id }) else { return }
        selectedPlace = place
        mode = .addShopDetail
        cameraCommand = MapCameraCommand(
            center: CLLocationCoordinate2D(latitude: place.latitude, longitude: place.longitude),
            span: Self.shopZoomSpan,
            duration: Self.selectAnimDuration
        )
    }

    func deselectPlace() {
        selectedPlace = nil
        mode = .addShop
        fitCameraToResults()
    }

    func submitShop() async {
        guard let selectedPlace else { return }
        isSubmittingShop = true
        try? await shopsService.saveShop(selectedPlace.shop)
        isSubmittingShop = false
        exitAddShop()
    }

    func hideList() {
        mode = .browse
    }

    func showPlace(named query: String) {
        autocompleteTask?.cancel()
        Task {
            guard let target = await geocodingService.coordinate(for: query) else { return }
            clearSearch()
            let longitudeDelta = Self.placeLatitudeDelta / cos(target.latitude * .pi / 180)
            cameraCommand = MapCameraCommand(
                center: CLLocationCoordinate2D(latitude: target.latitude, longitude: target.longitude),
                span: MKCoordinateSpan(latitudeDelta: Self.placeLatitudeDelta, longitudeDelta: longitudeDelta),
                duration: Self.recenterAnimDuration
            )
        }
    }

    func clearSearch() {
        searchQuery = ""
        placePredictions = []
    }

    func deselectShop() {
        selectedShop = nil
        restoreBrowseCamera()
    }

    // A direct route is credited to whoever added the destination shop
    func startDirectRoute(to shop: ShopDisplay) {
        startRoute(stops: [shop]) { [routesService, userCoordinate] in
            try await routesService.directRoute(
                to: shop,
                origin: userCoordinate,
                createdBy: shop.addedByUsername,
                userId: shop.shop.addedByUserId
            )
        }
    }

    // Shared entry point for every route source — direct, builder, suggestions.
    // Owns the route lifecycle: cancel the prior compute, show the loading
    // panel, then draw and frame the result.
    private func startRoute(stops: [ShopDisplay], compute: @escaping () async throws -> RouteResponse) {
        routeTask?.cancel()
        selectedShop = nil
        routeStops = stops
        activeRoute = nil
        routeErrorMessage = nil
        isRouteLoading = true
        mode = .route
        routeTask = Task {
            do {
                let route = try await compute()
                guard !Task.isCancelled else { return }
                activeRoute = route
                isRouteLoading = false
                fitCameraToRoute()
            } catch {
                guard !Task.isCancelled else { return }
                routeErrorMessage = error.localizedDescription
                isRouteLoading = false
            }
        }
    }

    func exitRoute() {
        routeTask?.cancel()
        activeRoute = nil
        routeStops = []
        routeErrorMessage = nil
        isRouteLoading = false
        restoreBrowseCamera()
    }

    private func fitCameraToRoute() {
        guard let region = Maps.region(
            enclosing: routePolyline,
            paddingFactor: Self.fitPaddingFactor,
            minimumSpan: Self.shopZoomSpan
        ) else { return }
        cameraCommand = MapCameraCommand(
            center: region.center,
            span: region.span,
            duration: Self.recenterAnimDuration
        )
    }

    // Back to browse mode at the viewport the user last browsed, never
    // tighter than the default browse zoom
    private func restoreBrowseCamera() {
        mode = .browse
        guard let region = visibleRegion else { return }
        cameraCommand = MapCameraCommand(
            center: region.center,
            span: MKCoordinateSpan(
                latitudeDelta: max(region.span.latitudeDelta, Self.browseSpan.latitudeDelta),
                longitudeDelta: max(region.span.longitudeDelta, Self.browseSpan.longitudeDelta)
            ),
            duration: Self.selectAnimDuration
        )
    }

    private func scheduleAddShopSearch() {
        addShopSearchTask?.cancel()
        if selectedPlace != nil {
            selectedPlace = nil
            mode = .addShop
        }
        let query = addShopQuery.trimmingCharacters(in: .whitespaces)
        guard query.count >= Self.minSearchLength else {
            addShopResults = []
            isSearchingPlaces = false
            return
        }
        isSearchingPlaces = true
        addShopSearchTask = Task {
            try? await Task.sleep(for: Self.autocompleteDebounce)
            guard !Task.isCancelled else { return }
            let places = (try? await placesService.searchText(query: query, near: userCoordinate)) ?? []
            guard !Task.isCancelled else { return }
            addShopResults = places.enumerated().map { i, place in
                var shop = Shop(place: place, niche: niche)
                shop.photoUrl = place.photos?.first.flatMap {
                    placesService.photoURL(for: $0, maxWidthPx: Self.photoMaxWidthPx)?.absoluteString
                }
                return ShopDisplay(shop: shop, distanceMi: distanceMiles(to: shop), palIdx: i % Palette.polCount)
            }
            isSearchingPlaces = false
            if selectedPlace == nil {
                fitCameraToResults()
            }
        }
    }

    private func fitCameraToResults() {
        guard let region = Maps.region(
            enclosing: addShopResults.map { Coordinate(latitude: $0.latitude, longitude: $0.longitude) },
            paddingFactor: Self.fitPaddingFactor,
            minimumSpan: Self.browseSpan
        ) else { return }
        cameraCommand = MapCameraCommand(
            center: region.center,
            span: region.span,
            duration: Self.recenterAnimDuration
        )
    }

    private func scheduleAutocomplete() {
        autocompleteTask?.cancel()
        let query = searchQuery
        guard query.count >= Self.minSearchLength else {
            placePredictions = []
            return
        }
        autocompleteTask = Task {
            try? await Task.sleep(for: Self.autocompleteDebounce)
            guard !Task.isCancelled else { return }
            placePredictions = (try? await placesService.autocomplete(query: query)) ?? []
        }
    }

    private func distanceMiles(to shop: Shop) -> Double? {
        userCoordinate.map {
            Geo.miles(from: $0, to: Coordinate(latitude: shop.latitude, longitude: shop.longitude))
        }
    }

    private func fetchKey(for region: MKCoordinateRegion) -> String {
        let values = [
            region.center.latitude,
            region.center.longitude,
            region.span.latitudeDelta,
            region.span.longitudeDelta,
        ]
        return values
            .map { String(($0 * Self.gridPrecision).rounded() / Self.gridPrecision) }
            .joined(separator: ",")
    }

    private func fetchShops(around region: MKCoordinateRegion) async {
        isLoading = true
        defer { isLoading = false }

        // Vote counts and usernames come from this scaffold until the backend exists
        let template = (try? await shopsService.fetchNearbyShops(
            latitude: region.center.latitude,
            longitude: region.center.longitude,
            niche: niche,
            limit: Self.maxResults
        )) ?? []
        guard !template.isEmpty else {
            shops = []
            return
        }
        // Places only takes a circle — use the one enclosing the viewport
        let halfLatMeters = region.span.latitudeDelta * Self.metersPerDegreeLatitude / 2
        let halfLngMeters = region.span.longitudeDelta * Self.metersPerDegreeLatitude
            * cos(region.center.latitude * .pi / 180) / 2
        let radius = min(
            max((halfLatMeters * halfLatMeters + halfLngMeters * halfLngMeters).squareRoot(), Self.minSearchRadiusMeters),
            Self.maxSearchRadiusMeters
        )
        let places = (try? await placesService.searchNearby(
            latitude: region.center.latitude,
            longitude: region.center.longitude,
            radiusMeters: radius,
            maxResults: Self.maxResults
        )) ?? []

        guard !places.isEmpty else {
            shops = template.enumerated().map { i, shop in
                ShopDisplay(shop: shop, distanceMi: distanceMiles(to: shop), palIdx: i % Palette.polCount)
            }
            return
        }

        shops = places.enumerated().map { i, place in
            let mock = template[i % template.count]
            let photoUrl = place.photos?.first.flatMap {
                placesService.photoURL(for: $0, maxWidthPx: Self.photoMaxWidthPx)?.absoluteString
            }
            let openState = openState(for: place.currentOpeningHours)
            let shop = mock.overlaying(place, photoUrl: photoUrl)
            return ShopDisplay(
                shop: shop,
                distanceMi: distanceMiles(to: shop),
                isOpen: openState.isOpen,
                closingTime: openState.closingTime,
                palIdx: i % Palette.polCount
            )
        }
    }

    private func openState(for hours: PlaceOpeningHours?) -> (isOpen: Bool, closingTime: String) {
        guard let hours, let openNow = hours.openNow else { return (false, "") }
        let timestamp = openNow ? hours.nextCloseTime : hours.nextOpenTime
        guard let timestamp, let date = DateUtils.parseISO8601(timestamp) else { return (openNow, "") }
        return (openNow, "\(openNow ? "Closes" : "Opens") \(DateUtils.shortTime(date))")
    }
}
