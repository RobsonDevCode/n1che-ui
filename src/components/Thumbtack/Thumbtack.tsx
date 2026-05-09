import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme';

interface ThumbstackProps {
  index: number;
  selected?: boolean;
  size?: number;
}

export default function Thumbtack({ index, selected = false, size = 14 }: ThumbstackProps) {
  const pinColor = selected ? colors.pop : colors.pinColors[index % colors.pinColors.length];
  const light = lighten(pinColor, 55);
  const dark  = darken(pinColor, 25);

  return (
    <View style={styles.wrapper} pointerEvents="none">
      <LinearGradient
        colors={[light, pinColor, dark]}
        locations={[0, 0.55, 1]}
        start={{ x: 0.36, y: 0.3 }}
        end={{ x: 0.85, y: 0.9 }}
        style={[styles.head, { width: size, height: size, borderRadius: size / 2, borderColor: darken(pinColor, 35) }]}
      />
      <View style={styles.shaft} />
    </View>
  );
}

function lighten(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + amt);
  const g = Math.min(255, ((n >> 8)  & 0xff) + amt);
  const b = Math.min(255, (n         & 0xff) + amt);
  return `rgb(${r},${g},${b})`;
}

function darken(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - amt);
  const g = Math.max(0, ((n >> 8)  & 0xff) - amt);
  const b = Math.max(0, (n         & 0xff) - amt);
  return `rgb(${r},${g},${b})`;
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    filter: undefined,
  } as any,
  head: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 4,
  },
  shaft: {
    width: 2,
    height: 9,
    backgroundColor: 'rgba(90,90,90,0.7)',
  },
});
