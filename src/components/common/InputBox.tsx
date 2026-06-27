import { StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, StyleProp } from 'react-native';
import { colors, fonts, spacing } from '../../theme';

type InputVariant = 'default' | 'ink';
type InputSize = 'sm' | 'md' | 'lg';

interface Props extends Omit<TextInputProps, 'style'> {
  label: string;
  variant?: InputVariant;
  size?: InputSize;
  disabled?: boolean;
  inputStyle?: StyleProp<TextStyle>;
}

const SIZE_CONFIG: Record<InputSize, { fontSize: number; paddingV: number; paddingH: number; labelSize: number }> = {
  sm: { fontSize: 13, paddingV: 6,  paddingH: 10, labelSize: 8 },
  md: { fontSize: 15, paddingV: 10, paddingH: spacing.md, labelSize: 9 },
  lg: { fontSize: 17, paddingV: 14, paddingH: spacing.lg, labelSize: 10 },
};

export default function InputBox({
  label, variant = 'default', size = 'md', disabled = false,
  inputStyle, ...rest
}: Props) {
  const s = SIZE_CONFIG[size];
  const isInk = variant === 'ink';

  return (
    <View style={styles.field}>
      <Text style={[
        styles.label,
        { fontSize: s.labelSize },
        isInk && styles.labelInk,
        disabled && styles.labelDisabled,
      ]}>
        {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            fontSize: s.fontSize,
            paddingVertical: s.paddingV,
            paddingHorizontal: s.paddingH,
          },
          isInk && styles.inputInk,
          disabled && styles.inputDisabled,
          inputStyle,
        ]}
        placeholderTextColor={disabled ? colors.grey2 : (isInk ? 'rgba(240,237,230,0.4)' : colors.grey)}
        editable={!disabled}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing.md },
  label: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.ink,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  labelInk: {
    color: colors.paper,
  },
  labelDisabled: {
    color: colors.grey,
  },
  input: {
    fontFamily: fonts.special,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.ink,
  },
  inputInk: {
    backgroundColor: 'rgba(240,237,230,0.08)',
    borderColor: 'rgba(240,237,230,0.25)',
    color: colors.paper,
  },
  inputDisabled: {
    backgroundColor: colors.paper2,
    borderColor: colors.grey2,
    color: colors.grey,
  },
});
