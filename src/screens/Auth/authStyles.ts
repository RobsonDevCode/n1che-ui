import { StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../theme';

export const authStyles = StyleSheet.create({
  error: {
    fontFamily: fonts.special,
    fontSize: 13,
    color: '#8B1A1A',
    marginBottom: spacing.sm,
  },
  linkBtn: { alignItems: 'center', paddingVertical: spacing.sm },
  linkText: { fontFamily: fonts.special, fontSize: 13, color: colors.ink2 },
  linkBold: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.ink,
  },
});
