import { useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
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

const ZOOM_DELTA = { latitudeDelta: 0.004, longitudeDelta: 0.003 };
const LIST_DELTA  = { latitudeDelta: 0.012, longitudeDelta: 0.008 };

export default function MapScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const { height: screenH } = useWindowDimensions();

  // ── Map height animation ───────────────────────────────────────────────────
  const mapHeightFull   = Math.round(screenH * 0.45);
  const mapHeightDetail = Math.round(screenH * 0.28);
  const mapHeightAnim   = useRef(new Animated.Value(mapHeightFull)).current;
  const mapRef          = useRef<MapView>(null);

  const animateMap = (toValue: number) =>
    Animated.timing(mapHeightAnim, { toValue, duration: 300, useNativeDriver: false }).start();

  // ── Location & region ──────────────────────────────────────────────────────
  const { coords, label: locationLabel, loading: locationLoading } = useLocation();

  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  const hasSetInitialRegion = useRef(false);
  const regionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (coords && !hasSetInitialRegion.current) {
      hasSetInitialRegion.current = true;
      setMapRegion({ ...coords, ...LIST_DELTA });
    }
  }, [coords]);

  const handleRegionChangeComplete = (region: Region) => {
    clearTimeout(regionTimer.current);
    regionTimer.current = setTimeout(() => setMapRegion(region), 400);
  };

  const bounds = mapRegion ? {
    swLat: mapRegion.latitude - mapRegion.latitudeDelta / 2,
    swLng: mapRegion.longitude - mapRegion.longitudeDelta / 2,
    neLat: mapRegion.latitude + mapRegion.latitudeDelta / 2,
    neLng: mapRegion.longitude + mapRegion.longitudeDelta / 2,
  } : null;

  // ── Shop data ──────────────────────────────────────────────────────────────
  const selectedNiche = useAppSelector(s => s.niche.selectedNiche);
  const nicheLabel    = NICHES.find(n => n.id === selectedNiche)?.label ?? selectedNiche ?? 'Shops';
  const shops         = useNearbyShops(selectedNiche ?? 'goth', bounds);

  const fallbackRegion = selectedNiche === 'vintage' ? PORTOBELLO_REGION : DEFAULT_REGION;
  const initialRegion  = coords ? { ...coords, ...LIST_DELTA } : fallbackRegion;

  // ── Search ─────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery]       = useState('');
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestion[]>([]);

  const shopSuggestions = searchQuery.length > 1
    ? shops.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  const showDropdown = searchQuery.length > 1 && (shopSuggestions.length > 0 || placeSuggestions.length > 0);

  useEffect(() => {
    if (searchQuery.length < 2) { setPlaceSuggestions([]); return; }
    const timer = setTimeout(async () => {
      setPlaceSuggestions(await autocomplete(searchQuery));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const jumpToPlace = async (query: string) => {
    Keyboard.dismiss();
    const results = await Location.geocodeAsync(query);
    if (!results.length) return;
    const { latitude, longitude } = results[0];
    mapRef.current?.animateToRegion({ latitude, longitude, latitudeDelta: 0.08, longitudeDelta: 0.06 }, 600);
    setSearchQuery('');
    setPlaceSuggestions([]);
  };

  const clearSearch = () => {
    Keyboard.dismiss();
    setSearchQuery('');
    setPlaceSuggestions([]);
  };

  // ── Selection ──────────────────────────────────────────────────────────────
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const selectedShop = shops.find(s => s.id === selectedPin) ?? null;

  const handleShopSelect = (shop: MockShop) => {
    if (selectedPin === shop.id) { handleDeselect(); return; }
    setSelectedPin(shop.id);
    animateMap(mapHeightDetail);
    mapRef.current?.animateToRegion({ latitude: shop.latitude, longitude: shop.longitude, ...ZOOM_DELTA }, 400);
  };

  const handleDeselect = () => {
    setSelectedPin(null);
    animateMap(mapHeightFull);
    const center = mapRegion ?? (coords ? { ...coords, ...LIST_DELTA } : null);
    if (center) {
      mapRef.current?.animateToRegion(
        { ...center, latitudeDelta: Math.max(center.latitudeDelta, LIST_DELTA.latitudeDelta), longitudeDelta: Math.max(center.longitudeDelta, LIST_DELTA.longitudeDelta) },
        400,
      );
    }
  };

  // TODO: replace with in-app Google Directions API route renderer
  const handleDirections = (_shop: MockShop) => {};

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
          ? <View style={[styles.mapPlaceholder, { top: 0, left: 0, right: 0, bottom: 0, position: 'absolute' }]} />
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
              {shops.map((shop, i) => {
                const isSelected = selectedPin === shop.id;
                return (
                  <Marker
                    key={`${shop.id}-${isSelected}`}
                    coordinate={{ latitude: shop.latitude, longitude: shop.longitude }}
                    onPress={() => handleShopSelect(shop)}
                    anchor={{ x: 0.5, y: 1 }}
                    tracksViewChanges={false}
                  >
                    <MapMarker shop={shop} index={i} selected={isSelected} />
                  </Marker>
                );
              })}
            </MapView>
          )
        }

        <View style={styles.locationChip}>
          <View style={[styles.locationDot, { backgroundColor: colors.pop }]} />
          <Text style={styles.locationText}>{locationLabel || 'Locating…'}</Text>
        </View>

        <TouchableOpacity style={styles.routeBtn} onPress={() => navigation.navigate('Route')} activeOpacity={0.85}>
          <Text style={styles.routeBtnText}>BEST ROUTE →</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom panel */}
      {selectedShop
        ? <ShopPanel key={selectedShop.id} shop={selectedShop} onBack={handleDeselect} onDirections={handleDirections} />
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
    overflow: 'hidden',
  },
  mapFill: {
    ...StyleSheet.absoluteFillObject,
  },
  mapPlaceholder: {
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
