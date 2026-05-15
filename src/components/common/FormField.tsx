import { StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, StyleProp } from 'react-native';
import { colors, fonts, spacing } from '../../theme';

interface Props extends TextInputProps {
  label: string;
  inputStyle?: StyleProp<TextStyle>;
}

export default function FormField({ label, inputStyle, ...rest }: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, inputStyle]}
        placeholderTextColor={colors.grey}
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
  input: {
    fontFamily: fonts.special,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.ink,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
});
