import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme';

const REQUIREMENTS = [
  { label: '8+ characters',     test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter',  test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter',  test: (p: string) => /[a-z]/.test(p) },
  { label: 'Number',            test: (p: string) => /\d/.test(p) },
  { label: 'Special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function PasswordRequirements({ password }: { password: string }) {
  return (
    <View style={styles.container}>
      {REQUIREMENTS.map(({ label, test }) => {
        const met = password.length > 0 && test(password);
        return (
          <View key={label} style={styles.row}>
            <Text style={[styles.indicator, met && styles.indicatorMet]}>{met ? '✓' : '·'}</Text>
            <Text style={[styles.label, met && styles.labelMet]}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginBottom: 8,
    rowGap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    gap: 5,
  },
  indicator: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.grey,
    width: 10,
  },
  indicatorMet: {
    color: colors.ink,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.grey,
  },
  labelMet: {
    color: colors.ink,
  },
});
