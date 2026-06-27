import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme';

export const styles = StyleSheet.create({
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
