import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, fonts, fontSizes, spacing } from '../../theme';

interface Props {
  onPress: () => void;
  label?: string;
  children?: React.ReactNode;
  variant?: 'outline' | 'primary' | 'ghost' | 'action' | 'link' | 'chip' | 'paper' | 'icon' | 'cta' | 'danger' | 'pill' | 'pillFlat';
  active?: boolean;
  disabled?: boolean;
  loading?: boolean;
  rotate?: number;
  style?: ViewStyle;
}

export default function Button({
  label,
  children,
  onPress,
  variant = 'outline',
  active = false,
  disabled = false,
  loading = false,
  rotate,
  style,
}: Props) {
  const rotation = rotate ?? (variant === 'primary' ? -0.3 : 0);

  const containerStyle = {
    outline:   styles.outline,
    primary:   disabled ? styles.primaryDisabled : styles.primary,
    ghost:     styles.ghost,
    action:    active ? styles.actionActive : styles.action,
    link:      styles.link,
    chip:      active ? styles.chipActive : styles.chip,
    paper:     styles.paper,
    icon:      styles.icon,
    cta:       styles.cta,
    danger:    styles.danger,
    pill:      active ? styles.pillActive : styles.pill,
    pillFlat:  active ? styles.pillFlatActive : styles.pillFlat,
  }[variant];

  const textStyle = {
    outline:   styles.outlineText,
    primary:   styles.primaryText,
    ghost:     styles.ghostText,
    action:    active ? styles.actionTextActive : styles.actionText,
    link:      styles.linkText,
    chip:      active ? styles.chipTextActive : styles.chipText,
    paper:     styles.paperText,
    icon:      styles.iconText,
    cta:       styles.ctaText,
    danger:    styles.dangerText,
    pill:      active ? styles.pillTextActive : styles.pillText,
    pillFlat:  active ? styles.pillFlatTextActive : styles.pillFlatText,
  }[variant];

  const indicatorColor =
    variant === 'primary' || variant === 'ghost' || variant === 'danger' ||
    (variant === 'action'   && active) || (variant === 'chip'     && active) ||
    (variant === 'pill'     && active) || (variant === 'pillFlat' && active)
      ? colors.white
      : colors.ink;

  const content = loading
    ? <ActivityIndicator color={indicatorColor} />
    : children ?? <Text style={textStyle}>{(label ?? '').toUpperCase()}</Text>;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={disabled ? 1 : 0.85}
      disabled={loading || disabled}
      style={[containerStyle, { transform: [{ rotate: `${rotation}deg` }] }, style]}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outline: {
    borderWidth: 3,
    borderColor: colors.ink,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.paper,
    alignItems: 'center',
  },
  outlineText: {
    fontFamily: fonts.bebas,
    fontSize: fontSizes.h3,
    color: colors.ink,
    letterSpacing: 2,
  },

  ghost: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  ghostText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.5)',
  },

  primary: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: colors.pop,
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  primaryDisabled: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: colors.grey2,
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  primaryText: {
    fontFamily: fonts.bebas,
    fontSize: 20,
    letterSpacing: 2.4,
    color: colors.white,
  },

  action: {
    paddingVertical: 13,
    borderWidth: 3,
    borderColor: colors.ink,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionActive: {
    paddingVertical: 13,
    borderWidth: 3,
    borderColor: colors.ink,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontFamily: fonts.bebas,
    fontSize: 16,
    letterSpacing: 1.5,
    color: colors.ink,
  },
  actionTextActive: {
    fontFamily: fonts.bebas,
    fontSize: 16,
    letterSpacing: 1.5,
    color: colors.white,
  },

  link: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  linkText: {
    fontFamily: fonts.special,
    fontSize: 13,
    color: colors.ink2,
  },

  paper: {
    backgroundColor: colors.paper,
    paddingVertical: 11,
    alignItems: 'center' as const,
  },
  paperText: {
    fontFamily: fonts.bebas,
    fontSize: 16,
    letterSpacing: 2,
    color: colors.ink,
  },

  chip: {
    borderWidth: 2,
    borderColor: colors.ink,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  chipActive: {
    borderWidth: 2,
    borderColor: colors.ink,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: colors.ink,
    alignItems: 'center',
  },
  chipText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.ink,
  },
  chipTextActive: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.white,
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
  iconText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.ink,
  },

  cta: {
    borderRadius: 13,
    backgroundColor: colors.paper,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontFamily: fonts.bebas,
    fontSize: 20,
    letterSpacing: 2.5,
    color: colors.ink,
  },

  danger: {
    borderRadius: 23,
    paddingVertical: 13,
    paddingHorizontal: 16,
    backgroundColor: '#C0392B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerText: {
    fontFamily: fonts.bebas,
    fontSize: 18,
    letterSpacing: 2,
    color: colors.white,
  },

  // Floating pill — map overlay controls. Shadow lifts it off the map surface.
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
  pillActive: {
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
  pillText: {
    fontFamily: fonts.bebas,
    fontSize: 14,
    letterSpacing: 1.5,
    color: colors.ink,
  },
  pillTextActive: {
    fontFamily: fonts.bebas,
    fontSize: 14,
    letterSpacing: 1.5,
    color: colors.white,
  },

  // Flat pill — in-panel buttons. Same shape as pill without the floating shadow.
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
  pillFlatActive: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: colors.ink,
    borderWidth: 2,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillFlatText: {
    fontFamily: fonts.bebas,
    fontSize: 14,
    letterSpacing: 1.5,
    color: colors.ink,
  },
  pillFlatTextActive: {
    fontFamily: fonts.bebas,
    fontSize: 14,
    letterSpacing: 1.5,
    color: colors.white,
  },
});
