import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { ShopDisplay } from '../../types/shopDisplay';

const PIN_COLORS = [
  { face: '#c43a2f', edge: '#7a1f17' },
  { face: '#2a5e8c', edge: '#173a55' },
  { face: '#2f7a4a', edge: '#1a4a2a' },
  { face: '#b8742a', edge: '#6e4214' },
  { face: '#8a2840', edge: '#4d1424' },
];

const TILTS = [-2.5, 1.5, -1.5, 2.0, -1.0, 1.0, -2.0, 2.5];

function shortName(name: string): string {
  const first = name.split(/[\s&]/)[0];
  if (first.length <= 10) return first;
  return first.slice(0, 9) + '.';
}

interface MapMarkerProps {
  shop: ShopDisplay;
  index: number;
  selected?: boolean;
}

export default function MapMarker({ shop, index, selected = false }: MapMarkerProps) {
  const pin = selected
    ? { face: colors.ink, edge: '#000000' }
    : PIN_COLORS[index % PIN_COLORS.length];
  const tilt = TILTS[index % TILTS.length];
  const num  = String(index + 1).padStart(2, '0');
  const label = shortName(shop.name);

  return (
    <View style={styles.container}>
      {/* Card — tilt applied here only so stem + pin stay vertical */}
      <View style={[styles.card, selected && styles.cardSelected, { transform: [{ rotate: `${tilt}deg` }] }]}>
        <View style={[styles.badge, selected && styles.badgeSelected]}>
          <Text style={[styles.badgeText, selected && styles.badgeTextSelected]}>{num}</Text>
        </View>
        <Text style={[styles.nameText, selected && styles.nameTextSelected]} numberOfLines={1}>
          {label}
        </Text>
      </View>

      {/* Stem */}
      <View style={styles.stem} />

      {/* Pushpin head */}
      <View style={[styles.pinHead, { backgroundColor: pin.face, borderColor: pin.edge }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderWidth: 1.5,
    borderColor: colors.ink,
    backgroundColor: colors.ink,
  },
  cardSelected: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 6,
  },
  badge: {
    backgroundColor: colors.paper,
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRightWidth: 1,
    borderRightColor: colors.ink,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeSelected: {
    backgroundColor: colors.ink,
  },
  badgeText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: colors.ink,
  },
  badgeTextSelected: {
    color: colors.paper,
  },
  nameText: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: colors.paper,
    paddingHorizontal: 9,
    paddingVertical: 4,
    textTransform: 'uppercase',
  },
  nameTextSelected: {
    color: colors.paper,
  },
  stem: {
    width: 1.5,
    height: 14,
    backgroundColor: colors.ink,
  },
  pinHead: {
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 2,
    marginTop: -2,
  },
});
