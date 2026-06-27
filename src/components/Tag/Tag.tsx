import { Text, View } from 'react-native';
import { TagProps } from './types';
import { styles } from './constants';

export default function Tag({ label }: TagProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
    </View>
  );
}
