import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../theme';
import Button from '../../components/common/Button';
import Title from '../../components/common/Title';
import Subtitle from '../../components/common/Subtitle';
import { RouteFilters, RouteResponse } from '../../types/route';

// ── Props ─────────────────────────────────────────────────────────────────

interface Props {
  route: RouteResponse | null;
  loading: boolean;
  initialMode: 'you' | 'loop';
  onBeginRoute: () => void;
  onRefetch: (filters: RouteFilters) => void;
  onExit: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────

export default function RoutePanel({ route, loading, initialMode, onBeginRoute, onExit }: Props) {
  const mode  = route?.mode ?? initialMode;
  const stops = route?.stops ?? [];

  return (
    <View style={styles.sheet}>

      {/* Title row */}
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <Title size={35} color={colors.paper}>{route?.name ?? 'BEST ROUTE'}</Title>
          <Subtitle color="rgba(240,238,233,0.55)" style={styles.subtitleSpacing}>
            {mode === 'you' ? 'HOTTEST · FROM YOU' : 'HOTTEST · LOOP'}
          </Subtitle>
        </View>
        <Button
          variant="icon"
          onPress={onExit}
          style={styles.closeBtn}
        >
          <Text style={styles.closeBtnText}>✕</Text>
        </Button>
      </View>

      {/* ETA block */}
      {loading || !route ? (
        <View style={styles.loadingBlock}>
          <ActivityIndicator color={colors.paper} size="large" />
        </View>
      ) : (
        <View style={styles.etaBlock}>
          <Title size={60} color={colors.paper} style={styles.etaTime}>
            {route.estimatedRouteTime}
          </Title>
          <View style={styles.statsCols}>
            {([['STOPS', String(stops.length)], ['DIST', route.totalDistanceStr], ['UPVOTES', `↑${route.totalUpvotes}`]] as const).map(([k, v]) => (
              <View key={k} style={styles.statCol}>
                <Subtitle size={10} color="rgba(240,238,233,0.5)">{k}</Subtitle>
                <Title size={22} color={colors.paper}>{v}</Title>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* BEGIN ROUTE */}
      <Button variant="cta" label="BEGIN ROUTE →" onPress={onBeginRoute} style={styles.beginBtn} />

    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    backgroundColor: colors.ink,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: 'hidden',
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 15,
  },
  titleLeft: { flex: 1, marginRight: 12 },
  subtitleSpacing: { marginTop: 3 },

  closeBtn: {
    borderColor: 'rgba(240,238,233,0.4)',
  },
  closeBtnText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.paper,
  },

  loadingBlock: { paddingVertical: 32, alignItems: 'center' },

  etaBlock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    gap: 20,
    marginBottom: 28,
  },
  etaTime: { letterSpacing: -1 },
  statsCols: {
    flexDirection: 'row',
    gap: 22,
    paddingBottom: 6,
  },
  statCol: { gap: 5 },

  beginBtn: { marginHorizontal: 20 },
});
