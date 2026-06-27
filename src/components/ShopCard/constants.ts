import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme';

export const NAME_FONTS = [fonts.oswald, fonts.fellItalic] as const;

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey2,
  },

  rank: {
    width: 24,
    height: 24,
    flexShrink: 0,
    borderWidth: 2,
    borderColor: colors.grey2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankFirst: {
    backgroundColor: colors.pop,
    borderColor: colors.pop,
  },

  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    color: colors.ink,
    lineHeight: 18,
  },
  address: {
    fontFamily: fonts.special,
    fontSize: 11,
    color: colors.grey,
    marginTop: 2,
  },

  right: {
    flexShrink: 0,
    alignItems: 'flex-end',
    gap: 3,
  },
  openRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dot: {
    width: 5,
    height: 5,
  },
});
