import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme';

interface Props {
  label: string;
  onPress: () => void;
}

export default function NicheChip({ label, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.chip} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.text}>{label.toUpperCase()} ▾</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.pop,
    paddingHorizontal: 10,
    paddingVertical: 4,
    transform: [{ rotate: '-1deg' }],
  },
  text: {
    fontFamily: fonts.bebas,
    fontSize: 14,
    letterSpacing: 1.5,
    color: colors.white,
  },
});
