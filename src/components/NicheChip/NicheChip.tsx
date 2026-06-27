import { Text, TouchableOpacity } from 'react-native';
import { NicheChipProps } from './types';
import { styles } from './constants';

export default function NicheChip({ label, onPress }: NicheChipProps) {
  return (
    <TouchableOpacity style={styles.chip} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.text}>{label.toUpperCase()} ▾</Text>
    </TouchableOpacity>
  );
}
