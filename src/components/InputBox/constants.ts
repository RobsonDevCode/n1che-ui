import { TextStyle, ViewStyle } from 'react-native';
import { colors, fonts, spacing } from '../../theme';
import { InputSize, InputVariant } from './types';

export const SIZE: Record<InputSize, { fontSize: number; paddingV: number; paddingH: number; labelSize: number }> = {
  sm: { fontSize: 13, paddingV: 6,  paddingH: 10,         labelSize: 8 },
  md: { fontSize: 15, paddingV: 10, paddingH: spacing.md, labelSize: 9 },
  lg: { fontSize: 17, paddingV: 14, paddingH: spacing.lg, labelSize: 10 },
};

export const VARIANT_INPUT: Record<InputVariant, TextStyle> = {
  default: {
    color: colors.ink,
    backgroundColor: colors.white,
    borderColor: colors.ink,
  },
  ink: {
    color: colors.paper,
    backgroundColor: 'rgba(240,237,230,0.08)',
    borderColor: 'rgba(240,237,230,0.25)',
  },
};

export const VARIANT_LABEL: Record<InputVariant, TextStyle> = {
  default: { color: colors.ink },
  ink:     { color: colors.paper },
};

export const VARIANT_PLACEHOLDER: Record<InputVariant, string> = {
  default: colors.grey,
  ink:     'rgba(240,237,230,0.4)',
};

export const DISABLED_INPUT: TextStyle = {
  backgroundColor: colors.paper2,
  borderColor: colors.grey2,
  color: colors.grey,
};

export const DISABLED_LABEL: TextStyle = {
  color: colors.grey,
};

export const ISSUE_INPUT: TextStyle = {
  borderColor: '#AE1C14',
};

export const ISSUE_LABEL: TextStyle = {
  color: '#AE1C14',
};

export const HELPER_BASE: TextStyle = {
  fontFamily: fonts.special,
  fontSize: 11,
  marginTop: 4,
  color: colors.grey,
};

export const HELPER_ISSUE: TextStyle = {
  color: '#AE1C14',
};

export const BASE_INPUT: TextStyle = {
  fontFamily: fonts.special,
  borderWidth: 2,
};

export const BASE_LABEL: TextStyle = {
  fontFamily: fonts.mono,
  letterSpacing: 1.5,
  textTransform: 'uppercase',
  marginBottom: 4,
};

export const FIELD: ViewStyle = {
  marginBottom: spacing.md,
};
