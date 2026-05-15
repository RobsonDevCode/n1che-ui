import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing } from '../../theme';

interface Props {
  title: string;
}

export default function AuthHeader({ title }: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const year = new Date().getUTCFullYear();
  const watermarkSize = Math.round(height * 0.09);
  const headerHeight = Math.max(Math.round(height * 0.22) - insets.top, 120);

  return (
    <View style={[styles.header, { height: headerHeight }]}>
      <Text
        style={[styles.watermark, { fontSize: watermarkSize, lineHeight: watermarkSize, width }]}
        numberOfLines={1}
        pointerEvents="none"
      >
        NICHE
      </Text>
      <View style={styles.headerContent}>
        <View style={styles.badgeRow}>
          <View style={styles.issueBadge}>
            <Text style={styles.issueText}>ISSUE №01</Text>
          </View>
          <Text style={styles.dateLine}>{year} · LONDON</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.ink, overflow: 'hidden', flexShrink: 0 },
  watermark: {
    position: 'absolute',
    right: 5,
    top: 10,
    textAlign: 'right',
    fontFamily: fonts.bebas,
    color: 'rgba(255,255,255,0.05)',
    letterSpacing: -2,
  } as any,
  headerContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  issueBadge: {
    backgroundColor: colors.pop,
    paddingHorizontal: 8,
    paddingVertical: 3,
    transform: [{ rotate: '-1deg' }],
  },
  issueText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.white,
    textTransform: 'uppercase',
  },
  dateLine: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1.2,
  },
  title: {
    fontFamily: fonts.bebas,
    fontSize: 46,
    color: colors.white,
    letterSpacing: 2,
    lineHeight: 50,
  },
});
