import { StyleSheet } from 'react-native';
import { colors, fonts, fontSizes, spacing } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.ink,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.label,
    color: colors.ink,
    letterSpacing: 1.5,
  },
});
