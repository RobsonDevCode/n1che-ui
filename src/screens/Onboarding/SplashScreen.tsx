import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, fonts, spacing } from '../../theme';
import CorkBoard from '../../components/CorkBoard/CorkBoard';
import { RootNavigationProp } from '../../navigation/types';

export default function SplashScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const titleSize = Math.round(width * 0.20);
  const watermarkSize = Math.round(height * 0.13);
  const headerHeight = Math.max(Math.round(height * 0.30) - insets.top, 170);
  const year = new Date().getFullYear();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
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

          <Text style={[styles.title, { fontSize: titleSize, lineHeight: titleSize * 1.1 }]}>
            NICHE
          </Text>

          <Text style={styles.subtitle}>
            Find the stores your{'\n'}people actually shop at.
          </Text>
        </View>
      </View>

      <View style={styles.separator} />

      <CorkBoard />

      <View style={[styles.cta, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('NichePicker')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Find Your Niche →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.75}
        >
          <Text style={styles.secondaryBtnText}>Already have an account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ink,
  },

  header: {
    backgroundColor: colors.ink,
    overflow: 'hidden',
    flexShrink: 0,
  },
  watermark: {
    position: 'absolute',
    right: -15,
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
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
    color: colors.white,
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: fonts.fellItalic,
    fontStyle: 'italic',
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 8,
    lineHeight: 20,
  },

  separator: {
    height: 4,
    backgroundColor: colors.pop,
    flexShrink: 0,
  },

  cta: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.paper,
    borderTopWidth: 4,
    borderTopColor: colors.pop,
    gap: 8,
    flexShrink: 0,
  },
  primaryBtn: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: colors.pop,
    alignItems: 'center',
    transform: [{ rotate: '-0.3deg' }],
  },
  primaryBtnText: {
    fontFamily: fonts.bebas,
    fontSize: 20,
    letterSpacing: 2.4,
    color: colors.white,
  },
  secondaryBtn: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.ink,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontFamily: fonts.oswald,
    fontWeight: '200',
    fontSize: 13,
    letterSpacing: 2,
    color: colors.ink,
    textTransform: 'uppercase',
  },
});
