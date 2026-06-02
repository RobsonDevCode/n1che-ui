import { useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import MapView, { Marker, Polyline, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { colors, fonts } from '../../theme';
import { useAppSelector } from '../../store/hooks';
import { RootNavigationProp } from '../../navigation/types';
import { NICHES } from '../Niche/niches';
import { DEFAULT_REGION, PORTOBELLO_REGION, MockShop } from './mockShops';
import mapStyle from './mapStyle';
import { autocomplete } from '../../services/maps/googlePlaces';
import { useNearbyShops } from '../../hooks/useNearbyShops';
import { useLocation } from '../../hooks/useLocation';
import InkHeader from '../../components/common/InkHeader';
import HeaderTitle from '../../components/common/HeaderTitle';
import NicheChip from '../../components/common/NicheChip';
import SearchBar from '../../components/common/SearchBar';
import SearchDropdown, { PlaceSuggestion } from '../../components/common/SearchDropdown';
import MapMarker from '../../components/MapMarker/MapMarker';
import ShopPanel from './ShopPanel';
import ShopList from './ShopList';
import RoutePanel from './RoutePanel';
import RoutePickerPanel from './RoutePickerPanel';
import { useRoute } from '../../hooks/useRoute';

// Camera deltas (lat/lng span visible in the map viewport)
const ZOOM_DELTA     = { latitudeDelta: 0.004, longitudeDelta: 0.003 }; // tight zoom when a shop is selected
const LIST_DELTA     = { latitudeDelta: 0.02,  longitudeDelta: 0.02  }; // neighbourhood zoom for the shop list
const JUMP_LAT_DELTA = 0.06; // city-level latitude span after a place search (~6km)

// Map height as fraction of screen height
const MAP_HEIGHT_RATIO        = 0.45; // list mode
const MAP_HEIGHT_DETAIL_RATIO = 0.28; // shop selected mode

// Timings (ms)
const MAP_ANIM_MS              = 300;
const REGION_DEBOUNCE_MS       = 400;
const AUTOCOMPLETE_DEBOUNCE_MS = 400;
const SELECT_ANIM_MS           = 400;
const JUMP_ANIM_MS             = 600;

export default function MapScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const { height: screenH, width: screenW } = useWindowDimensions();

  // ── Map height animation ───────────────────────────────────────────────────
  const mapHeightFull   = Math.round(screenH * MAP_HEIGHT_RATIO);
  const mapHeightDetail = Math.round(screenH * MAP_HEIGHT_DETAIL_RATIO);
  const mapHeightAnim   = useRef(new Animated.Value(mapHeightFull)).current;
  const mapRef          = useRef<MapView>(null);

  const animateMap = (toValue: number) =>
    Animated.timing(mapHeightAnim, { toValue, duration: MAP_ANIM_MS, useNativeDriver: false }).start();

  // ── Selection ──────────────────────────────────────────────────────────────
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  // ── Location & region ──────────────────────────────────────────────────────
  const { coords, label: locationLabel, loading: locationLoading } = useLocation();

  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  const hasSetInitialRegion = useRef(false);
  const regionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => { clearTimeout(regionTimer.current); };
  }, []);

  useEffect(() => {
    if (coords && !hasSetInitialRegion.current) {
      hasSetInitialRegion.current = true;
      setMapRegion({ ...coords, ...LIST_DELTA });
    }
  }, [coords]);

  const handleRegionChangeComplete = (region: Region) => {
    if (selectedPin || isRoutePickerMode || isRouteMode) return;
    clearTimeout(regionTimer.current);
    regionTimer.current = setTimeout(() => setMapRegion(region), REGION_DEBOUNCE_MS);
  };

  const bounds = mapRegion ? {
    swLat: mapRegion.latitude  - mapRegion.latitudeDelta  / 2,
    swLng: mapRegion.longitude - mapRegion.longitudeDelta / 2,
    neLat: mapRegion.latitude  + mapRegion.latitudeDelta  / 2,
    neLng: mapRegion.longitude + mapRegion.longitudeDelta / 2,
  } : null;

  // ── Route state ────────────────────────────────────────────────────────────
  const [isRoutePickerMode, setIsRoutePickerMode] = useState(false);
  const [pickerSelectedId,  setPickerSelectedId]  = useState<string | null>(null);
  const [isRouteMode,       setIsRouteMode]        = useState(false);

  const { suggestions, data: routeData, loading: routeLoading, findSuggestions, beginRoute, clearRoute } = useRoute();

  const handleEnterRoutePicker = () => {
    if (selectedPin) {
      setSelectedPin(null);
      animateMap(mapHeightFull);
    }
    setIsRoutePickerMode(true);
    setPickerSelectedId(null);
    findSuggestions(shops, coords, bounds);
  };

  const handleExitRoutePicker = () => {
    setIsRoutePickerMode(false);
    setPickerSelectedId(null);
    clearRoute();
  };

  const handleBeginRoute = () => {
    const selected = suggestions.find(r => r.id === pickerSelectedId);
    if (!selected) return;
    beginRoute(selected);
    setIsRoutePickerMode(false);
    setPickerSelectedId(null);
    setIsRouteMode(true);
  };

  const handleExitRouteMode = () => {
    setIsRouteMode(false);
    clearRoute();
  };

  // TODO: wire up search filtering when backend API is complete
  const handleRouteSearch = (_query: string) => {};

  // ── Shop data ──────────────────────────────────────────────────────────────
  const selectedNiche = useAppSelector(s => s.niche.selectedNiche);
  const nicheLabel    = NICHES.find(n => n.id === selectedNiche)?.label ?? selectedNiche ?? 'Shops';
  const shops         = useNearbyShops(selectedNiche ?? 'goth', bounds);

  const fallbackRegion = selectedNiche === 'vintage' ? PORTOBELLO_REGION : DEFAULT_REGION;
  const initialRegion  = coords ? { ...coords, ...LIST_DELTA } : fallbackRegion;

  // ── Search ─────────────────────────────────────────────────────────────────
  const [searchQuery,       setSearchQuery]       = useState('');
  const [placeSuggestions,  setPlaceSuggestions]  = useState<PlaceSuggestion[]>([]);

  const shopSuggestions = searchQuery.length > 1
    ? shops.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  const showDropdown = searchQuery.length > 1 && (shopSuggestions.length > 0 || placeSuggestions.length > 0);

  useEffect(() => {
    if (searchQuery.length < 2) { setPlaceSuggestions([]); return; }
    const timer = setTimeout(async () => {
      setPlaceSuggestions(await autocomplete(searchQuery));
    }, AUTOCOMPLETE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const jumpToPlace = async (query: string) => {
    Keyboard.dismiss();
    const results = await Location.geocodeAsync(query);
    if (!results.length) return;
    const { latitude, longitude } = results[0];
    const mapH = screenH * MAP_HEIGHT_RATIO;
    const longitudeDelta = JUMP_LAT_DELTA / Math.cos(latitude * Math.PI / 180) * (screenW / mapH);
    const newRegion = { latitude, longitude, latitudeDelta: JUMP_LAT_DELTA, longitudeDelta };
    setMapRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, JUMP_ANIM_MS);
    setSearchQuery('');
    setPlaceSuggestions([]);
  };

  const clearSearch = () => {
    Keyboard.dismiss();
    setSearchQuery('');
    setPlaceSuggestions([]);
  };

  // ── Selection handlers ─────────────────────────────────────────────────────
  const selectedShop = shops.find(s => s.id === selectedPin) ?? null;

  const handleShopSelect = (shop: MockShop) => {
    if (selectedPin === shop.id) { handleDeselect(); return; }
    setSelectedPin(shop.id);
    animateMap(mapHeightDetail);
    mapRef.current?.animateToRegion({ latitude: shop.latitude, longitude: shop.longitude, ...ZOOM_DELTA }, SELECT_ANIM_MS);
  };

  const handleDeselect = () => {
    setSelectedPin(null);
    animateMap(mapHeightFull);
    const center = mapRegion ?? (coords ? { ...coords, ...LIST_DELTA } : null);
    if (center) {
      mapRef.current?.animateToRegion(
        { ...center, latitudeDelta: Math.max(center.latitudeDelta, LIST_DELTA.latitudeDelta), longitudeDelta: Math.max(center.longitudeDelta, LIST_DELTA.longitudeDelta) },
        SELECT_ANIM_MS,
      );
    }
  };

  // TODO: replace with in-app Google Directions API route renderer
  const handleDirections = (_shop: MockShop) => {};

  // ── Picker route preview (drives polyline while picker is open) ────────────
  const pickerPreviewRoute = isRoutePickerMode && suggestions.length > 0
    ? (suggestions.find(r => r.id === pickerSelectedId) ?? suggestions[0])
    : null;

  return (
    <View style={styles.screen}>
      <InkHeader>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <HeaderTitle style={styles.headerTitle}>NICHE</HeaderTitle>
          <NicheChip label={nicheLabel} onPress={() => navigation.navigate('NichePicker')} />
        </View>
      </InkHeader>

      <View style={styles.searchWrapper}>
        <SearchBar
          placeholder="Search shops or locations…"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={jumpToPlace}
        />
        {showDropdown && (
          <SearchDropdown
            shopResults={shopSuggestions}
            placeResults={placeSuggestions}
            onSelectShop={shop => { clearSearch(); handleShopSelect(shop); }}
            onSelectPlace={place => { clearSearch(); jumpToPlace(place.description); }}
          />
        )}
      </View>

      {/* Map */}
      <Animated.View style={[styles.mapWrap, { height: mapHeightAnim }]}>
        {locationLoading
          ? <View style={styles.mapPlaceholder} />
          : (
            <MapView
              ref={mapRef}
              style={styles.mapFill}
              provider={PROVIDER_GOOGLE}
              initialRegion={initialRegion}
              showsUserLocation
              showsMyLocationButton={false}
              showsCompass={false}
              toolbarEnabled={false}
              customMapStyle={mapStyle}
              onRegionChangeComplete={handleRegionChangeComplete}
            >
              {/* Shop markers — hidden in route/picker mode */}
              {!isRouteMode && !isRoutePickerMode && shops.map((shop, i) => {
                const isSelected = selectedPin === shop.id;
                return (
                  <Marker
                    key={`marker-${i}`}
                    coordinate={{ latitude: shop.latitude, longitude: shop.longitude }}
                    onPress={() => handleShopSelect(shop)}
                    anchor={{ x: 0.5, y: 1 }}
                    tracksViewChanges={false}
                    opacity={selectedPin && !isSelected ? 0 : 1}
                  >
                    <MapMarker shop={shop} index={i} selected={isSelected} />
                  </Marker>
                );
              })}

              {/* Active route polyline */}
              {isRouteMode && routeData && (
                <Polyline
                  coordinates={[
                    ...(routeData.mode === 'you' && coords
                      ? [{ latitude: coords.latitude, longitude: coords.longitude }]
                      : []),
                    ...routeData.stops.map(s => ({ latitude: s.latitude, longitude: s.longitude })),
                    ...(routeData.mode === 'loop' && routeData.stops.length > 0
                      ? [{ latitude: routeData.stops[0].latitude, longitude: routeData.stops[0].longitude }]
                      : []),
                  ]}
                  strokeColor={colors.ink}
                  strokeWidth={2.5}
                />
              )}

              {/* Active route stop markers */}
              {isRouteMode && routeData && routeData.stops.map((stop, i) => (
                <Marker
                  key={`route-${stop.id}`}
                  coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
                  anchor={{ x: 0.5, y: 1 }}
                  tracksViewChanges={false}
                >
                  <MapMarker shop={stop} index={i} selected={false} />
                </Marker>
              ))}

              {/* Picker preview polyline — updates as the user taps route cards */}
              {pickerPreviewRoute && (
                <Polyline
                  coordinates={[
                    ...(pickerPreviewRoute.mode === 'you' && coords
                      ? [{ latitude: coords.latitude, longitude: coords.longitude }]
                      : []),
                    ...pickerPreviewRoute.stops.map(s => ({ latitude: s.latitude, longitude: s.longitude })),
                    ...(pickerPreviewRoute.mode === 'loop' && pickerPreviewRoute.stops.length > 0
                      ? [{ latitude: pickerPreviewRoute.stops[0].latitude, longitude: pickerPreviewRoute.stops[0].longitude }]
                      : []),
                  ]}
                  strokeColor={colors.ink}
                  strokeWidth={2.5}
                />
              )}

              {/* Picker preview stop markers */}
              {pickerPreviewRoute && pickerPreviewRoute.stops.map((stop, i) => (
                <Marker
                  key={`picker-${stop.id}`}
                  coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
                  anchor={{ x: 0.5, y: 1 }}
                  tracksViewChanges={false}
                >
                  <MapMarker shop={stop} index={i} selected={false} />
                </Marker>
              ))}
            </MapView>
          )
        }

        <View style={styles.locationChip}>
          <View style={[styles.locationDot, { backgroundColor: colors.pop }]} />
          <Text style={styles.locationText}>{locationLabel || 'Locating…'}</Text>
        </View>

        {!isRouteMode && !isRoutePickerMode && (
          <TouchableOpacity style={styles.routeBtn} onPress={handleEnterRoutePicker} activeOpacity={0.85}>
            <Text style={styles.routeBtnText}>FIND ROUTES →</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Bottom panel */}
      {selectedShop
        ? <ShopPanel key={selectedShop.id} shop={selectedShop} onBack={handleDeselect} onDirections={handleDirections} />
        : isRoutePickerMode
          ? <RoutePickerPanel
              routes={suggestions}
              loading={routeLoading}
              selectedId={pickerSelectedId}
              onSelect={setPickerSelectedId}
              onBegin={handleBeginRoute}
              onClose={handleExitRoutePicker}
              onSearch={handleRouteSearch}
            />
          : isRouteMode
            ? <RoutePanel
                route={routeData}
                loading={routeLoading}
                initialMode="you"
                onBeginRoute={() => { /* TODO: hand off to native maps navigation */ }}
                onExit={handleExitRouteMode}
              />
            : <ShopList shops={shops} nicheLabel={nicheLabel} onSelectShop={handleShopSelect} />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: { padding: 2 },
  backText: {
    fontFamily: fonts.oswald,
    fontSize: 20,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 22,
  },
  headerTitle: {
    fontSize: 28,
    letterSpacing: 1.5,
    flex: 1,
  },
  searchWrapper: {
    zIndex: 100,
    elevation: 100,
  },
  mapWrap: {
    width: '100%',
    flexShrink: 0,
  },
  mapCornerBridge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 10,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },
  mapFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -32,
  },
  mapPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.paper2,
  },
  locationChip: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.ink,
    paddingHorizontal: 10,
    paddingVertical: 4,
    transform: [{ rotate: '-0.5deg' }],
    zIndex: 40,
  },
  locationDot: { width: 6, height: 6 },
  locationText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.ink,
  },
  routeBtn: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    backgroundColor: colors.ink,
    paddingHorizontal: 14,
    paddingVertical: 9,
    transform: [{ rotate: '0.4deg' }],
    zIndex: 40,
  },
  routeBtnText: {
    fontFamily: fonts.bebas,
    fontSize: 14,
    letterSpacing: 1.5,
    color: colors.white,
  },
});
