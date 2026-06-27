import { Text, View } from 'react-native';
import { colors } from '../../theme';
import { OpenBadgeProps } from './types';
import { OPEN_DOT_COLOR, styles } from './constants';

export default function OpenBadge({ isOpen, closingTime }: OpenBadgeProps) {
  const dotColor = isOpen ? OPEN_DOT_COLOR : colors.grey2;
  const textColor = isOpen ? colors.white : colors.grey2;

  return (
    <View style={styles.badge}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text style={[styles.text, { color: textColor }]}>
        {isOpen ? 'OPEN' : 'CLOSED'}
      </Text>
      <Text style={[styles.time, { color: textColor }]}>{closingTime}</Text>
    </View>
  );
}
