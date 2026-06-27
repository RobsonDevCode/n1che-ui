import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../theme';
import {
  CONTAINER_ACTIVE,
  CONTAINER_STYLE,
  DISABLED_CONTAINER,
  INDICATOR_LIGHT_VARIANTS,
  INDICATOR_LIGHT_WHEN_ACTIVE,
  TEXT_ACTIVE,
  TEXT_STYLE,
} from './constants';
import { ButtonProps } from './types';

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
}: ButtonProps) {
  const rotation = rotate ?? (variant === 'primary' ? -0.3 : 0);

  const baseContainer = active
    ? (CONTAINER_ACTIVE[variant] ?? CONTAINER_STYLE[variant])
    : CONTAINER_STYLE[variant];

  const container = disabled
    ? (DISABLED_CONTAINER[variant] ?? baseContainer)
    : baseContainer;

  const textStyle = active
    ? (TEXT_ACTIVE[variant] ?? TEXT_STYLE[variant])
    : TEXT_STYLE[variant];

  const indicatorColor =
    INDICATOR_LIGHT_VARIANTS.has(variant) ||
    (active && INDICATOR_LIGHT_WHEN_ACTIVE.has(variant))
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
      style={[container, { transform: [{ rotate: `${rotation}deg` }] }, style]}
    >
      {content}
    </TouchableOpacity>
  );
}
