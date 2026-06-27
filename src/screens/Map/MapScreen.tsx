import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Keyboard, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import MapView, { Marker, Polyline, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { colors, fonts } from '../../theme';
import { useAppSelector } from '../../store/hooks';
import { RootNavigationProp } from '../../navigation/types';
import { NICHES } from '../Niche/niches';
import { DEFAULT_REGION, PORTOBELLO_REGION, MockShop } from './mockShops';
import mapStyle from './mapStyle';
import { autocomplete, textSearch, PlaceResult } from '../../services/maps/googlePlaces';
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
import NavigationPrompt from '../../components/NavigationPrompt/NavigationPrompt';
import Button from '../../components/common/Button';
import { useRoute, buildDirectRoute } from '../../hooks/useRoute';
import { useNavigationSession } from '../../hooks/useNavigationSession';
import MapNavBar from './MapNavBar';
import AddShopPanel from './AddShopPanel';
import ListIcon from '../../components/icons/ListIcon';
import AddShopIcon from '../../components/icons/AddShopIcon';
import RouteIcon from '../../components/icons/RouteIcon';
import MapIcon from '../../components/icons/MapIcon';
import { NavPositionUpdate, NavState } from '../../types/navigation';
import { computeBearing, offsetPosition } from '../../utils/geo';
import { NAV_ZOOM, NAV_PITCH, NAV_FOLLOW_OFFSET_M, HEADING_SMOOTH_ALPHA, BEARING_MIN_DIST_M } from '../../constants/navigation';

const ZOOM_DELTA     = { latitudeDelta: 0.004, longitudeDelta: 0.003 };
const LIST_DELTA     = { latitudeDelta: 0.02,  longitudeDelta: 0.02  };
const JUMP_LAT_DELTA = 0.06;

const MAP_HEIGHT_RATIO        = 0.45;
const MAP_HEIGHT_DETAIL_RATIO = 0.28;
const MAP_HEIGHT_NAV_RATIO    = 0.55;
const MAP_HEIGHT_NAVBAR_RATIO = 0.78;
const MAP_HEIGHT_LIST_RATIO   = 0.44;

const MAP_ANIM_MS              = 300;
const REGION_DEBOUNCE_MS       = 400;
const AUTOCOMPLETE_DEBOUNCE_MS = 400;
const SELECT_ANIM_MS           = 400;
const JUMP_ANIM_MS             = 600;
const RECENTER_ANIM_MS         = 600;


export default function MapScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const { height: screenH, width: screenW } = useWindowDimensions();

  const mapHeightFull   = Math.round(screenH * MAP_HEIGHT_RATIO);
  const mapHeightDetail = Math.round(screenH * MAP_HEIGHT_DETAIL_RATIO);
  const mapHeightNav    = Math.round(screenH * MAP_HEIGHT_NAV_RATIO);
  const mapHeightNavBar = Math.round(screenH * MAP_HEIGHT_NAVBAR_RATIO);
  const mapHeightList   = Math.round(screenH * MAP_HEIGHT_LIST_RATIO);
  const mapHeightAnim   = useRef(new Animated.Value(mapHeightNavBar)).current;
  const mapRef          = useRef<MapView>(null);

  const animateMap = (toValue: number) =>
    Animated.timing(mapHeightAnim, { toValue, duration: MAP_ANIM_MS, useNativeDriver: false }).start();

  const [selectedPin, setSelectedPin] = useState<string | null>(null);

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
    if (selectedPin || isRoutePickerMode || isRouteMode || isAddShopMode) return;
    clearTimeout(regionTimer.current);
    regionTimer.current = setTimeout(() => setMapRegion(region), REGION_DEBOUNCE_MS);
  };

  const bounds = mapRegion ? {
    swLat: mapRegion.latitude  - mapRegion.latitudeDelta  / 2,
    swLng: mapRegion.longitude - mapRegion.longitudeDelta / 2,
    neLat: mapRegion.latitude  + mapRegion.latitudeDelta  / 2,
    neLng: mapRegion.longitude + mapRegion.longitudeDelta / 2,
  } : null;

  const [isRoutePickerMode, setIsRoutePickerMode] = useState(false);
  const [pickerSelectedId,  setPickerSelectedId]  = useState<string | null>(null);
  const [isRouteMode,       setIsRouteMode]        = useState(false);
  const [navStarted,        setNavStarted]         = useState(false);
  const [muted,             setMuted]              = useState(false);
  const [arrivalTime,       setArrivalTime]        = useState<Date>(() => new Date());
  const [isListOpen,        setIsListOpen]         = useState(false);
  const [isAddShopMode,     setIsAddShopMode]      = useState(false);
  const [addShopQuery,      setAddShopQuery]       = useState('');
  const [addShopResults,    setAddShopResults]     = useState<PlaceResult[]>([]);
  const [addShopSearching,  setAddShopSearching]   = useState(false);
  const [selectedAddShop,   setSelectedAddShop]    = useState<PlaceResult | null>(null);
  const [addShopDesc,       setAddShopDesc]        = useState('');
  const [addShopSubmitting, setAddShopSubmitting]  = useState(false);

  useEffect(() => {
    if (isAddShopMode && addShopResults.length > 0 && !selectedAddShop) {
      const allCoords = addShopResults.map(p => ({ latitude: p.latitude, longitude: p.longitude }));
      mapRef.current?.fitToCoordinates(allCoords, {
        edgePadding: { top: 40, bottom: 40, left: 40, right: 40 },
        animated: true,
      });
    }
  }, [addShopResults, selectedAddShop, isAddShopMode]);

  // Follow-camera state — refs shadow state so callbacks don't go stale
  const [followCamera,   setFollowCamera]   = useState(true);
  const [cameraDetached, setCameraDetached] = useState(false);
  const followCameraRef   = useRef(true);
  const cameraDetachedRef = useRef(false);
  followCameraRef.current   = followCamera;
  cameraDetachedRef.current = cameraDetached;

  // Smoothed heading and last GPS fix — used only inside callbacks (no re-render needed)
  const smoothedHeadingRef = useRef(-1);
  const lastPositionRef    = useRef<{ latitude: number; longitude: number } | null>(null);

  const { suggestions, data: routeData, loading: routeLoading, findSuggestions, beginRoute, clearRoute } = useRoute();

  // Mock polylines are empty so off-route won't fire in dev.
  // When backend provides real polylines: call findSuggestions → navSession.updateRoute(newRoute).
  const onReroute = useCallback((_coords: { latitude: number; longitude: number }) => {}, []);

  const onPositionUpdate = useCallback((pos: NavPositionUpdate) => {
    const lastPos = lastPositionRef.current;

    // Resolve heading: prefer GPS value; fall back to bearing between consecutive fixes
    let rawHeading = pos.heading >= 0 ? pos.heading : -1;
    if (rawHeading < 0 && lastPos) {
      // 1° ≈ 111 320 m — cheap lower-bound distance check before calling computeBearing
      const approxMeters = Math.max(
        Math.abs(pos.latitude  - lastPos.latitude),
        Math.abs(pos.longitude - lastPos.longitude),
      ) * 111_320;
      if (approxMeters > BEARING_MIN_DIST_M) {
        rawHeading = computeBearing(lastPos.latitude, lastPos.longitude, pos.latitude, pos.longitude);
      }
    }

    // Exponential moving average to smooth jitter; handles the 350°→10° wrap
    if (rawHeading >= 0) {
      const prev = smoothedHeadingRef.current;
      if (prev < 0) {
        smoothedHeadingRef.current = rawHeading;
      } else {
        let delta = rawHeading - prev;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        smoothedHeadingRef.current = ((prev + HEADING_SMOOTH_ALPHA * delta) + 360) % 360;
      }
    }

    lastPositionRef.current = { latitude: pos.latitude, longitude: pos.longitude };

    if (!followCameraRef.current || cameraDetachedRef.current) return;

    const heading = smoothedHeadingRef.current;

    if (heading < 0) {
      // No reliable heading yet — centre on user, flat
      mapRef.current?.animateCamera(
        { center: { latitude: pos.latitude, longitude: pos.longitude }, heading: 0, pitch: 0, zoom: NAV_ZOOM },
        { duration: 800 },
      );
      return;
    }

    // Offset centre forward along heading so the user dot sits in the lower third
    const center = offsetPosition(pos.latitude, pos.longitude, heading, NAV_FOLLOW_OFFSET_M);
    mapRef.current?.animateCamera(
      { center, heading, pitch: NAV_PITCH, zoom: NAV_ZOOM },
      { duration: 1500 },
    );
  }, []);

  const navSession = useNavigationSession({ onReroute, onPositionUpdate, muted });

  // Helpers shared by the toggle and recenter handlers
  const snapToFollowView = (
    pos: { latitude: number; longitude: number } | null,
    heading: number,
  ) => {
    if (!pos) return;
    if (heading >= 0) {
      const center = offsetPosition(pos.latitude, pos.longitude, heading, NAV_FOLLOW_OFFSET_M);
      mapRef.current?.animateCamera(
        { center, heading, pitch: NAV_PITCH, zoom: NAV_ZOOM },
        { duration: RECENTER_ANIM_MS },
      );
    } else {
      mapRef.current?.animateCamera(
        { center: pos, heading: 0, pitch: 0, zoom: NAV_ZOOM },
        { duration: RECENTER_ANIM_MS },
      );
    }
  };

  const snapToRouteOverview = () => {
    if (!routeData || routeData.stops.length === 0) return;
    const stopCoords = routeData.stops.map(stop => ({ latitude: stop.latitude, longitude: stop.longitude }));
    if (coords) stopCoords.unshift({ latitude: coords.latitude, longitude: coords.longitude });
    mapRef.current?.fitToCoordinates(stopCoords, {
      edgePadding: { top: 60, bottom: 80, left: 40, right: 40 },
      animated: true,
    });
  };

  const handleToggleFollowCamera = () => {
    const nextFollow = !followCamera;
    setFollowCamera(nextFollow);
    setCameraDetached(false);
    if (nextFollow) {
      snapToFollowView(lastPositionRef.current, smoothedHeadingRef.current);
    } else {
      snapToRouteOverview();
    }
  };

  const handleRecenter = () => {
    setCameraDetached(false);
    snapToFollowView(lastPositionRef.current, smoothedHeadingRef.current);
  };

  const handleEnterRoutePicker = () => {
    if (selectedPin) setSelectedPin(null);
    setIsListOpen(false);

    setIsRoutePickerMode(true);
    setPickerSelectedId(null);
    animateMap(mapHeightFull);
    findSuggestions(shops, coords, bounds, authUsername, authUserId);
  };

  const handleExitRoutePicker = () => {
    setIsRoutePickerMode(false);
    setPickerSelectedId(null);
    animateMap(mapHeightNavBar);
    clearRoute();
  };

  const handleBeginRoute = () => {
    const selected = suggestions.find(route => route.id === pickerSelectedId);
    if (!selected) return;
    beginRoute(selected);
    setIsRoutePickerMode(false);
    setPickerSelectedId(null);
    setIsRouteMode(true);
  };

  const handleStartNavigation = () => {
    if (!routeData) return;
    const eta = new Date(Date.now() + routeData.totalMinutes * 60_000);
    setArrivalTime(eta);
    setNavStarted(true);
    setFollowCamera(true);
    setCameraDetached(false);
    smoothedHeadingRef.current = -1;
    lastPositionRef.current = null;
    animateMap(mapHeightNav);
    if (coords) {
      mapRef.current?.animateCamera(
        { center: coords, heading: 0, pitch: NAV_PITCH, zoom: NAV_ZOOM },
        { duration: 800 },
      );
    }
    navSession.start(routeData);
  };

  const handleStopNavigation = () => {
    navSession.stop();
    setNavStarted(false);
    setFollowCamera(true);
    setCameraDetached(false);
    smoothedHeadingRef.current = -1;
    lastPositionRef.current = null;
    animateMap(mapHeightFull);
    // Reset camera to flat overview of the route
    snapToRouteOverview();
  };

  const handleExitRouteMode = () => {
    navSession.stop();
    setNavStarted(false);
    setIsRouteMode(false);
    setFollowCamera(true);
    setCameraDetached(false);
    smoothedHeadingRef.current = -1;
    lastPositionRef.current = null;
    animateMap(mapHeightNavBar);
    clearRoute();
    if (coords) {
      mapRef.current?.animateCamera(
        { center: coords, heading: 0, pitch: 0 },
        { duration: RECENTER_ANIM_MS },
      );
    }
  };

  // TODO: wire up search filtering when backend API is complete
  const handleRouteSearch = (_query: string) => {};

  const authUsername  = useAppSelector(s => s.auth.username) ?? 'anonymous';
  const authUserId    = useAppSelector(s => s.auth.userId)   ?? '';

  const selectedNiche = useAppSelector(s => s.niche.selectedNiche);
  const nicheLabel    = NICHES.find(niche => niche.id === selectedNiche)?.label ?? selectedNiche ?? 'Shops';
  const shops         = useNearbyShops(selectedNiche ?? 'goth', bounds);

  const fallbackRegion = selectedNiche === 'vintage' ? PORTOBELLO_REGION : DEFAULT_REGION;
  const initialRegion  = coords ? { ...coords, ...LIST_DELTA } : fallbackRegion;

  const [searchQuery,      setSearchQuery]      = useState('');
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestion[]>([]);

  const shopSuggestions = searchQuery.length > 1
    ? shops.filter(shop => shop.name.toLowerCase().includes(searchQuery.toLowerCase()))
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
    const mapHeight = screenH * MAP_HEIGHT_RATIO;
    const longitudeDelta = JUMP_LAT_DELTA / Math.cos(latitude * Math.PI / 180) * (screenW / mapHeight);
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

  const selectedShop = shops.find(shop => shop.id === selectedPin) ?? null;

  const handleShopSelect = (shop: MockShop) => {
    if (selectedPin === shop.id) { handleDeselect(); return; }
    setSelectedPin(shop.id);
    setIsListOpen(false);

    animateMap(mapHeightDetail);
    mapRef.current?.animateToRegion({ latitude: shop.latitude, longitude: shop.longitude, ...ZOOM_DELTA }, SELECT_ANIM_MS);
  };

  const handleDeselect = () => {
    setSelectedPin(null);
    animateMap(mapHeightNavBar);
    const center = mapRegion ?? (coords ? { ...coords, ...LIST_DELTA } : null);
    if (center) {
      mapRef.current?.animateToRegion(
        { ...center, latitudeDelta: Math.max(center.latitudeDelta, LIST_DELTA.latitudeDelta), longitudeDelta: Math.max(center.longitudeDelta, LIST_DELTA.longitudeDelta) },
        SELECT_ANIM_MS,
      );
    }
  };

  const handleDirections = (shop: MockShop) => {
    const route = buildDirectRoute(shop, coords, authUsername, authUserId);
    beginRoute(route);
    setSelectedPin(null);
    animateMap(mapHeightFull);
    setIsRouteMode(true);
  };

  const handleToggleList = () => {
    const next = !isListOpen;
    setIsListOpen(next);
    animateMap(next ? mapHeightList : mapHeightNavBar);
  };

  const addShopDebounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleEnterAddShop = () => {
    if (selectedPin) setSelectedPin(null);
    setIsListOpen(false);
    setIsAddShopMode(true);
    animateMap(mapHeightNavBar);
  };

  const handleExitAddShop = () => {
    setIsAddShopMode(false);
    setAddShopQuery('');
    setAddShopResults([]);
    setAddShopSearching(false);
    setSelectedAddShop(null);
    setAddShopDesc('');
    clearTimeout(addShopDebounceRef.current);
    animateMap(mapHeightNavBar);
  };

  const handleAddShopSearch = useCallback((text: string) => {
    setAddShopQuery(text);
    setSelectedAddShop(null);
    setAddShopDesc('');
    animateMap(mapHeightNavBar);
    clearTimeout(addShopDebounceRef.current);

    if (text.trim().length < 2) {
      setAddShopResults([]);
      setAddShopSearching(false);
      return;
    }

    setAddShopSearching(true);
    addShopDebounceRef.current = setTimeout(async () => {
      try {
        const places = await textSearch(text, coords ?? null);
        setAddShopResults(places);
      } catch {
        setAddShopResults([]);
      } finally {
        setAddShopSearching(false);
      }
    }, AUTOCOMPLETE_DEBOUNCE_MS);
  }, [coords, mapHeightNavBar]);

  const handleSelectAddShop = (place: PlaceResult) => {
    Keyboard.dismiss();
    setSelectedAddShop(place);
    animateMap(mapHeightDetail);
    mapRef.current?.animateToRegion(
      { latitude: place.latitude, longitude: place.longitude, ...ZOOM_DELTA },
      SELECT_ANIM_MS,
    );
  };

  const handleDeselectAddShop = () => {
    setSelectedAddShop(null);
    setAddShopDesc('');
    animateMap(mapHeightNavBar);
    if (addShopResults.length > 0) {
      const allCoords = addShopResults.map(p => ({ latitude: p.latitude, longitude: p.longitude }));
      mapRef.current?.fitToCoordinates(allCoords, {
        edgePadding: { top: 40, bottom: 40, left: 40, right: 40 },
        animated: true,
      });
    }
  };

  const handleSubmitAddShop = async () => {
    if (!selectedAddShop) return;
    Keyboard.dismiss();
    setAddShopSubmitting(true);
    // TODO: POST /shops — send selectedAddShop.id, name, address, lat, lng, addShopDesc, selectedNiche
    setAddShopSubmitting(false);
    handleExitAddShop();
  };

  const pickerPreviewRoute = isRoutePickerMode && suggestions.length > 0
    ? (suggestions.find(route => route.id === pickerSelectedId) ?? suggestions[0])
    : null;

  const toPolylineCoords = (route: typeof routeData, origin: typeof coords) => {
    if (!route) return null;
    return [
      ...(route.mode === 'you' && origin ? [{ latitude: origin.latitude, longitude: origin.longitude }] : []),
      ...route.stops.map(stop => ({ latitude: stop.latitude, longitude: stop.longitude })),
      ...(route.mode === 'loop' && route.stops.length > 0 ? [{ latitude: route.stops[0].latitude, longitude: route.stops[0].longitude }] : []),
    ];
  };

  const activeRouteCoords   = toPolylineCoords(routeData, coords);
  const pickerPreviewCoords = toPolylineCoords(pickerPreviewRoute, coords);

  const isActivelyNavigating = navStarted
    && navSession.progress.state !== NavState.Idle
    && navSession.progress.state !== NavState.Completed;

  return (
    <View style={styles.screen}>

      {isActivelyNavigating ? (
        <NavigationPrompt
          progress={navSession.progress}
          muted={muted}
          onToggleMute={() => setMuted(prev => !prev)}
        />
      ) : (
        <InkHeader>
          <View style={styles.header}>
            <TouchableOpacity onPress={isAddShopMode ? handleExitAddShop : () => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <HeaderTitle style={styles.headerTitle}>{isAddShopMode ? 'ADD SHOP' : 'NICHE'}</HeaderTitle>
            {!isAddShopMode && <NicheChip label={nicheLabel} onPress={() => navigation.navigate('NichePicker')} />}
          </View>
        </InkHeader>
      )}

      {!isRoutePickerMode && !isRouteMode && (
        <View style={styles.searchWrapper}>
          {isAddShopMode ? (
            <SearchBar
              placeholder="Search shop name…"
              value={addShopQuery}
              onChangeText={handleAddShopSearch}
              onSubmit={() => {}}
            />
          ) : (
            <>
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
            </>
          )}
        </View>
      )}

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
              onPanDrag={() => {
                if (navStarted && followCameraRef.current) setCameraDetached(true);
              }}
            >
              {!isRouteMode && !isRoutePickerMode && !isAddShopMode && shops.map((shop, index) => {
                const isSelected = selectedPin === shop.id;
                return (
                  <Marker
                    key={`marker-${index}`}
                    coordinate={{ latitude: shop.latitude, longitude: shop.longitude }}
                    onPress={() => handleShopSelect(shop)}
                    anchor={{ x: 0.5, y: 1 }}
                    tracksViewChanges={false}
                    opacity={selectedPin && !isSelected ? 0 : 1}
                  >
                    <MapMarker shop={shop} index={index} selected={isSelected} />
                  </Marker>
                );
              })}

              {isAddShopMode && addShopResults.map((place, index) => (
                <Marker
                  key={`addshop-${place.id}`}
                  coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                  onPress={() => handleSelectAddShop(place)}
                  anchor={{ x: 0.5, y: 1 }}
                  tracksViewChanges={false}
                  opacity={selectedAddShop && selectedAddShop.id !== place.id ? 0.3 : 1}
                >
                  <MapMarker shop={place} index={index} selected={selectedAddShop?.id === place.id} />
                </Marker>
              ))}

              {isRouteMode && activeRouteCoords && (
                <>
                  <Polyline coordinates={activeRouteCoords} strokeColor={colors.pinColors[1]} strokeColors={[colors.pinColors[1], colors.pinColors[1]]} strokeWidth={9} lineCap="round" lineJoin="round" />
                  <Polyline coordinates={activeRouteCoords} strokeColor={colors.polPalette[4]} strokeColors={[colors.polPalette[4], colors.polPalette[4]]} strokeWidth={5} lineCap="round" lineJoin="round" />
                </>
              )}

              {isRouteMode && routeData && routeData.stops.map((stop, index) => (
                <Marker
                  key={`route-${stop.id}`}
                  coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
                  anchor={{ x: 0.5, y: 1 }}
                  tracksViewChanges={false}
                >
                  <MapMarker shop={stop} index={index} selected={index === navSession.progress.currentStopIndex && navStarted} />
                </Marker>
              ))}

              {pickerPreviewCoords && (
                <>
                  <Polyline coordinates={pickerPreviewCoords} strokeColor={colors.pinColors[1]} strokeColors={[colors.pinColors[1], colors.pinColors[1]]} strokeWidth={7} lineCap="round" lineJoin="round" />
                  <Polyline coordinates={pickerPreviewCoords} strokeColor={colors.polPalette[4]} strokeColors={[colors.polPalette[4], colors.polPalette[4]]} strokeWidth={4} lineCap="round" lineJoin="round" />
                </>
              )}

              {pickerPreviewRoute && pickerPreviewRoute.stops.map((stop, index) => (
                <Marker
                  key={`picker-${stop.id}`}
                  coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
                  anchor={{ x: 0.5, y: 1 }}
                  tracksViewChanges={false}
                >
                  <MapMarker shop={stop} index={index} selected={false} />
                </Marker>
              ))}
            </MapView>
          )
        }

        <View style={styles.locationChip}>
          <View style={[styles.locationDot, { backgroundColor: colors.pop }]} />
          <Text style={styles.locationText}>{locationLabel || 'Locating…'}</Text>
        </View>

        {navStarted && (
          <View style={styles.navCameraControls}>
            {cameraDetached && (
              <Button variant="pill" onPress={handleRecenter} style={styles.recenterBtn}>
                <Text style={styles.recenterBtnText}>⊕</Text>
              </Button>
            )}
            <Button
              variant="pill"
              active={followCamera}
              label={followCamera ? '2D' : '3D'}
              onPress={handleToggleFollowCamera}
            />
          </View>
        )}

      </Animated.View>

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
                arrivalTime={arrivalTime}
                onBeginRoute={handleStartNavigation}
                onStopNav={handleStopNavigation}
                onExit={handleExitRouteMode}
                navProgress={navSession.progress}
                isNavigating={navStarted}
              />
            : isListOpen
              ? <ShopList shops={shops} nicheLabel={nicheLabel} onSelectShop={handleShopSelect} onBack={handleToggleList} />
              : isAddShopMode && selectedAddShop
                ? <AddShopPanel
                    place={selectedAddShop}
                    description={addShopDesc}
                    onChangeDescription={setAddShopDesc}
                    submitting={addShopSubmitting}
                    onSubmit={handleSubmitAddShop}
                    onBack={handleDeselectAddShop}
                  />
                : (
                  <View style={styles.navBarArea}>
                    {isAddShopMode && addShopSearching && (
                      <View style={styles.addShopLoadingRow}>
                        <ActivityIndicator color={colors.ink} size="small" />
                      </View>
                    )}
                    <MapNavBar items={isAddShopMode ? [
                      { icon: <MapIcon size={22} color={colors.white} />, onPress: handleExitAddShop, active: true },
                      { icon: <AddShopIcon size={22} color={colors.ink} />, onPress: () => {} },
                    ] : [
                      { icon: <ListIcon size={22} color={isListOpen ? colors.white : colors.ink2} />, onPress: handleToggleList, active: isListOpen },
                      { icon: <AddShopIcon size={22} color={colors.ink} />, onPress: handleEnterAddShop },
                      { icon: <RouteIcon size={22} color={colors.ink} />, onPress: handleEnterRoutePicker },
                    ]} />
                  </View>
                )
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
  navBarArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  locationText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.ink,
  },
  navCameraControls: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    gap: 8,
    alignItems: 'flex-end',
    zIndex: 40,
  },
  recenterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  recenterBtnText: {
    fontFamily: fonts.mono,
    fontSize: 18,
    color: colors.ink,
    lineHeight: 20,
  },
  addShopLoadingRow: {
    alignItems: 'center',
    paddingVertical: 12,
  },
});
