import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, fonts, fontSizes, spacing } from '../../theme';

interface Props {
  onPress: () => void;
  label?: string;
  children?: React.ReactNode;
  variant?: 'outline' | 'primary' | 'ghost' | 'action' | 'link';
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
    outline: styles.outline,
    primary: disabled ? styles.primaryDisabled : styles.primary,
    ghost:   styles.ghost,
    action:  active ? styles.actionActive : styles.action,
    link:    styles.link,
  }[variant];

  const textStyle = {
    outline: styles.outlineText,
    primary: styles.primaryText,
    ghost:   styles.ghostText,
    action:  active ? styles.actionTextActive : styles.actionText,
    link:    styles.linkText,
  }[variant];

  const indicatorColor =
    variant === 'primary' || variant === 'ghost' || (variant === 'action' && active)
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
});
