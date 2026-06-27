import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: colors.ink,
    maxHeight: 260,
    zIndex: 200,
    elevation: 200,
  },
  scroll: {
    flex: 1,
  },
  sectionLabel: {
    fontFamily: fonts.mono,
    fontSize: 8,
    letterSpacing: 2,
    color: colors.grey,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
    backgroundColor: colors.paper2,
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey2,
    gap: 2,
  },
  rowPrimary: {
    fontFamily: fonts.special,
    fontSize: 13,
    color: colors.ink,
  },
  rowSecondary: {
    fontFamily: fonts.mono,
    fontSize: 8,
    letterSpacing: 1,
    color: colors.grey,
  },
});
