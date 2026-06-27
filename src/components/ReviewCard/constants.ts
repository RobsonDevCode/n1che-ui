import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme';

export const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey2,
    gap: 6,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  user: {
    fontFamily: fonts.bebas,
    fontSize: 13,
    letterSpacing: 0.5,
    color: colors.ink,
    flex: 1,
  },
  date: {
    fontFamily: fonts.mono,
    fontSize: 8,
    letterSpacing: 1,
    color: colors.grey,
  },
  body: {
    fontFamily: fonts.special,
    fontSize: 12,
    color: colors.ink2,
    lineHeight: 18,
  },
});
