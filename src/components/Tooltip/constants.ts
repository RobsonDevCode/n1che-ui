import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { colors, fonts } from '../../theme';

export const BUBBLE: ViewStyle = {
  backgroundColor: colors.ink,
  borderRadius: 10,
  paddingHorizontal: 14,
  paddingVertical: 10,
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 8,
};

export const TEXT: TextStyle = {
  fontFamily: fonts.special,
  fontSize: 12,
  color: colors.paper,
  lineHeight: 17,
  flex: 1,
};

export const INFO_ICON: TextStyle = {
  fontFamily: fonts.special,
  fontSize: 14,
  color: 'rgba(240,237,230,0.5)',
  lineHeight: 17,
};

export const CARET_SIZE = 8;

export const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  caretTop: {
    width: 0,
    height: 0,
    borderLeftWidth: CARET_SIZE,
    borderRightWidth: CARET_SIZE,
    borderBottomWidth: CARET_SIZE,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.ink,
    marginLeft: 20,
  },
  caretBottom: {
    width: 0,
    height: 0,
    borderLeftWidth: CARET_SIZE,
    borderRightWidth: CARET_SIZE,
    borderTopWidth: CARET_SIZE,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.ink,
    marginLeft: 20,
  },
});
