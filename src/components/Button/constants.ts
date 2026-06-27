import { TextStyle, ViewStyle } from 'react-native';
import { colors, fonts, fontSizes, spacing } from '../../theme';
import { ButtonVariant } from './types';

export const CONTAINER_STYLE: Record<ButtonVariant, ViewStyle> = {
  outline: {
    borderWidth: 3,
    borderColor: colors.ink,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.paper,
    alignItems: 'center',
  },
  primary: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: colors.pop,
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  ghost: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  action: {
    paddingVertical: 13,
    borderWidth: 3,
    borderColor: colors.ink,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  chip: {
    borderWidth: 2,
    borderColor: colors.ink,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  paper: {
    backgroundColor: colors.paper,
    paddingVertical: 11,
    alignItems: 'center' as const,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta: {
    borderRadius: 13,
    backgroundColor: colors.paper,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  danger: {
    borderRadius: 23,
    paddingVertical: 13,
    paddingHorizontal: 16,
    backgroundColor: '#C0392B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: 'rgba(17,17,17,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  pillFlat: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export const CONTAINER_ACTIVE: Partial<Record<ButtonVariant, ViewStyle>> = {
  action: {
    paddingVertical: 13,
    borderWidth: 3,
    borderColor: colors.ink,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    borderWidth: 2,
    borderColor: colors.ink,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: colors.ink,
    alignItems: 'center',
  },
  pill: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  pillFlat: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: colors.ink,
    borderWidth: 2,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export const TEXT_STYLE: Record<ButtonVariant, TextStyle> = {
  outline: {
    fontFamily: fonts.bebas,
    fontSize: fontSizes.h3,
    color: colors.ink,
    letterSpacing: 2,
  },
  primary: {
    fontFamily: fonts.bebas,
    fontSize: 20,
    letterSpacing: 2.4,
    color: colors.white,
  },
  ghost: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.5)',
  },
  action: {
    fontFamily: fonts.bebas,
    fontSize: 16,
    letterSpacing: 1.5,
    color: colors.ink,
  },
  link: {
    fontFamily: fonts.special,
    fontSize: 13,
    color: colors.ink2,
  },
  chip: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.ink,
  },
  paper: {
    fontFamily: fonts.bebas,
    fontSize: 16,
    letterSpacing: 2,
    color: colors.ink,
  },
  icon: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.ink,
  },
  cta: {
    fontFamily: fonts.bebas,
    fontSize: 20,
    letterSpacing: 2.5,
    color: colors.ink,
  },
  danger: {
    fontFamily: fonts.bebas,
    fontSize: 18,
    letterSpacing: 2,
    color: colors.white,
  },
  pill: {
    fontFamily: fonts.bebas,
    fontSize: 14,
    letterSpacing: 1.5,
    color: colors.ink,
  },
  pillFlat: {
    fontFamily: fonts.bebas,
    fontSize: 14,
    letterSpacing: 1.5,
    color: colors.ink,
  },
};

export const TEXT_ACTIVE: Partial<Record<ButtonVariant, TextStyle>> = {
  action: {
    fontFamily: fonts.bebas,
    fontSize: 16,
    letterSpacing: 1.5,
    color: colors.white,
  },
  chip: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.white,
  },
  pill: {
    fontFamily: fonts.bebas,
    fontSize: 14,
    letterSpacing: 1.5,
    color: colors.white,
  },
  pillFlat: {
    fontFamily: fonts.bebas,
    fontSize: 14,
    letterSpacing: 1.5,
    color: colors.white,
  },
};

export const DISABLED_CONTAINER: Partial<Record<ButtonVariant, ViewStyle>> = {
  primary: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: colors.grey2,
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
};

/** Variants where the ActivityIndicator should always be white. */
export const INDICATOR_LIGHT_VARIANTS: Set<ButtonVariant> = new Set([
  'primary',
  'ghost',
  'danger',
]);

/** Variants where the ActivityIndicator is white only when active. */
export const INDICATOR_LIGHT_WHEN_ACTIVE: Set<ButtonVariant> = new Set([
  'action',
  'chip',
  'pill',
  'pillFlat',
]);
