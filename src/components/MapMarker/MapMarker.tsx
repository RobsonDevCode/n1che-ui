import { Text, View } from 'react-native';
import { colors } from '../../theme';
import { MapMarkerProps } from './types';
import { PIN_COLORS, TILTS, styles } from './constants';

function shortName(name: string): string {
  const first = name.split(/[\s&]/)[0];
  if (first.length <= 10) return first;
  return first.slice(0, 9) + '.';
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
