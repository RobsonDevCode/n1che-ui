import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../theme';

interface OpenBadgeProps {
  isOpen: boolean;
  closingTime: string;
}

export default function OpenBadge({ isOpen, closingTime }: OpenBadgeProps) {
  const dotColor = isOpen ? '#4CAF50' : colors.grey2;
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

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.ink,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  dot: {
    width: 5,
    height: 5,
  },
  text: {
    fontFamily: fonts.mono,
    fontSize: 8,
    letterSpacing: 1.5,
  },
  time: {
    fontFamily: fonts.mono,
    fontSize: 8,
    letterSpacing: 1,
    opacity: 0.75,
  },
});
