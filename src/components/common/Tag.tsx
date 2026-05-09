import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSizes, spacing } from '../../theme';

interface TagProps {
  label: string;
}

export default function Tag({ label }: TagProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.ink,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.label,
    color: colors.ink,
    letterSpacing: 1.5,
  },
});
