import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme';

export const OPEN_DOT_COLOR = '#4CAF50';

export const styles = StyleSheet.create({
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
