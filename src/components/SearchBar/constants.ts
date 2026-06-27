import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { colors, fonts } from '../../theme';
import { SearchBarVariant } from './types';

export const CONTAINER: Record<SearchBarVariant, ViewStyle> = {
  default: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
  },
  ink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.ink,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(240,237,230,0.2)',
  },
};

export const ICON: Record<SearchBarVariant, TextStyle> = {
  default: {
    fontFamily: fonts.special,
    fontSize: 18,
    color: colors.grey,
    lineHeight: 20,
  },
  ink: {
    fontFamily: fonts.special,
    fontSize: 18,
    color: 'rgba(240,237,230,0.5)',
    lineHeight: 20,
  },
};

export const INPUT: Record<SearchBarVariant, TextStyle> = {
  default: {
    flex: 1,
    fontFamily: fonts.special,
    fontSize: 13,
    color: colors.ink,
    padding: 0,
  },
  ink: {
    flex: 1,
    fontFamily: fonts.special,
    fontSize: 13,
    color: colors.paper,
    padding: 0,
  },
};

export const PLACEHOLDER_COLOR: Record<SearchBarVariant, string> = {
  default: colors.grey,
  ink: 'rgba(240,237,230,0.4)',
};

export const styles = StyleSheet.create({
  clearBtn: {
    padding: 4,
  },
  clearText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    lineHeight: 14,
  },
});
