import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, fonts, fontSizes, spacing } from '../../theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  rotate?: number;
  style?: ViewStyle;
}

export default function Button({ label, onPress, rotate = 0, style }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { transform: [{ rotate: `${rotate}deg` }] }, style]}
      activeOpacity={0.8}
    >
      <Text style={styles.label}>{label.toUpperCase()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 3,
    borderColor: colors.ink,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.paper,
  },
  label: {
    fontFamily: fonts.bebas,
    fontSize: fontSizes.h3,
    color: colors.ink,
    letterSpacing: 2,
  },
});
