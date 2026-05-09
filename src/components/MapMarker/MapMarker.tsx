import { StyleSheet, View } from 'react-native';
import Polaroid from '../Polaroid/Polaroid';
import Thumbtack from '../Thumbtack/Thumbtack';
import { Shop } from '../../types/shop';

interface MapMarkerProps {
  shop: Shop;
  index: number;
  selected?: boolean;
}

const TACK_SIZE = 14;

export default function MapMarker({ shop, index, selected = false }: MapMarkerProps) {
  return (
    <View style={[styles.container, selected && styles.selectedContainer]}>
      <View style={styles.tack}>
        <Thumbtack index={index} selected={selected} size={TACK_SIZE} />
      </View>
      <Polaroid shop={shop} size="map" index={index} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  selectedContainer: {
    transform: [{ rotate: '-1deg' }],
  },
  tack: {
    marginBottom: -6,
    zIndex: 1,
  },
});
