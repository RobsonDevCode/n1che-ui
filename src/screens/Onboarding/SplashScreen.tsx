import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, fonts, spacing } from '../../theme';
import CorkBoard from '../../components/CorkBoard';
import { RootNavigationProp } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearUser } from '../../store/slices/authSlice';
import { signOut } from '../../services/auth/cognito';
import Button from '../../components/Button';
import InkHeader from '../../components/common/InkHeader';
import Tagline from '../../components/common/Tagline';
import HeaderTitle from '../../components/common/HeaderTitle';

export default function SplashScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(s => s.auth.isAuthenticated);
  const hasNiche = useAppSelector(s => !!s.niche.selectedNiche);

  const handleSignOut = async () => {
    await signOut();
    dispatch(clearUser());
  };
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const titleSize = Math.round(width * 0.20);
  const watermarkSize = Math.round(height * 0.13);
  const headerHeight = Math.max(Math.round(height * 0.30) - insets.top, 170);
  const year = new Date().getUTCFullYear();

  return (
    <View style={styles.screen}>
      <InkHeader>
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

            <HeaderTitle style={{ fontSize: titleSize, lineHeight: titleSize * 1.1, letterSpacing: 2 }}>
              NICHE
            </HeaderTitle>

            <Tagline style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
              Find the stores your{'\n'}people actually shop at.
            </Tagline>
          </View>
        </View>
      </InkHeader>

      <View style={styles.separator} />

      <CorkBoard />

      <View style={[styles.cta, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        {isAuthenticated ? (
          <>
            <Button
              variant="primary"
              label={hasNiche ? 'Enter The Map →' : 'Find Your Niche →'}
              onPress={() => navigation.navigate(hasNiche ? 'Map' : 'NichePicker')}
              style={styles.btnNoMargin}
            />
            <Button variant="outline" label="Sign Out" onPress={handleSignOut} />
          </>
        ) : (
          <>
            <Button
              variant="primary"
              label="Log In →"
              onPress={() => navigation.navigate('Login')}
              style={styles.btnNoMargin}
            />
            <Button variant="outline" label="Create an account" onPress={() => navigation.navigate('SignUp')} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },

  header: {
    overflow: 'hidden',
    flexShrink: 0,
  },
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
  btnNoMargin: { marginTop: 0, marginBottom: 0 },
});
