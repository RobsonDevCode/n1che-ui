import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../../theme';
import Button from '../../components/common/Button';
import Panel from '../../components/common/Panel';
import Title from '../../components/common/Title';
import Subtitle from '../../components/common/Subtitle';
import { RouteResponse } from '../../types/route';
import { NavProgress } from '../../types/navigation';

interface Props {
  route: RouteResponse | null;
  loading: boolean;
  initialMode: 'you' | 'loop';
  arrivalTime: Date;
  onBeginRoute: () => void;
  onStopNav: () => void;
  onExit: () => void;
  navProgress?: NavProgress;
  isNavigating?: boolean;
}

const DOT_SIZE   = 10;
const DOT_LINE_W = 18;

function formatArrival(date: Date): string {
  const hours   = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export default function RoutePanel({
  route, loading, initialMode, arrivalTime,
  onBeginRoute, onStopNav, onExit,
  navProgress, isNavigating,
}: Props) {
  const insets = useSafeAreaInsets();

  const mode        = route?.mode ?? initialMode;
  const stops       = route?.stops ?? [];
  const currentIdx  = navProgress?.currentStopIndex ?? 0;
  const currentStop = isNavigating && route ? route.stops[currentIdx] : null;

  if (isNavigating && navProgress && currentStop && route) {
    return (
      <Panel variant="ink">
        <View style={[styles.navContent, { paddingBottom: insets.bottom + 16 }]}>

          <View style={styles.navStopRow}>
            <View style={styles.navStopLeft}>
              <View style={styles.navDot} />
              <Text style={styles.navStopLabel} numberOfLines={1}>
                NEXT · STOP {String(currentIdx + 1).padStart(2, '0')} {currentStop.name.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.navCounter}>{currentIdx + 1} / {stops.length}</Text>
          </View>

          <Text style={styles.navTime}>{route.estimatedRouteTime}</Text>

          <Text style={styles.navMeta}>
            {route.totalDistanceStr.toUpperCase()} · ARRIVE {formatArrival(arrivalTime)}
          </Text>

          <View style={styles.dotsRow}>
            {stops.map((stop, index) => {
              const isPast    = index < currentIdx;
              const isCurrent = index === currentIdx;
              return (
                <View key={stop.id} style={styles.dotItem}>
                  <View style={[
                    styles.dot,
                    isPast    ? styles.dotPast    : null,
                    isCurrent ? styles.dotCurrent : null,
                    !isPast && !isCurrent ? styles.dotFuture : null,
                  ]} />
                  {index < stops.length - 1 && (
                    <View style={[styles.dotLine, isPast ? styles.dotLinePast : null]} />
                  )}
                </View>
              );
            })}
          </View>

          <View style={styles.navActions}>
            <Button variant="icon" onPress={onStopNav} style={styles.backBtn}>
              <Text style={styles.backBtnText}>←</Text>
            </Button>
            <Button variant="danger" label="EXIT" onPress={onExit} style={styles.exitBtn} />
          </View>

        </View>
      </Panel>
    );
  }

  return (
    <Panel variant="ink" style={styles.panelInner}>
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <Title size={35} color={colors.paper}>{route?.name ?? 'BEST ROUTE'}</Title>
          <Subtitle color="rgba(240,238,233,0.55)" style={styles.subtitleSpacing}>
            {mode === 'you' ? 'HOTTEST · FROM YOU' : 'HOTTEST · LOOP'}
          </Subtitle>
        </View>
        <Button variant="icon" onPress={onExit} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>←</Text>
        </Button>
      </View>

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
            {([['STOPS', String(stops.length)], ['DIST', route.totalDistanceStr], ['UPVOTES', `↑${route.totalUpvotes}`]] as const).map(([key, value]) => (
              <View key={key} style={styles.statCol}>
                <Subtitle size={10} color="rgba(240,238,233,0.5)">{key}</Subtitle>
                <Title size={22} color={colors.paper}>{value}</Title>
              </View>
            ))}
          </View>
        </View>
      )}

      <Button variant="cta" label="BEGIN ROUTE →" onPress={onBeginRoute} style={styles.beginBtn} />

    </Panel>
  );
}

const styles = StyleSheet.create({
  // Nav compact view
  navContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
  },

  navStopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  navStopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flex: 1,
    marginRight: 12,
  },
  navDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#3ad07a',
    flexShrink: 0,
  },
  navStopLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.8,
    color: 'rgba(240,237,230,0.7)',
    flexShrink: 1,
  },
  navCounter: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: 'rgba(240,237,230,0.45)',
    flexShrink: 0,
  },

  navTime: {
    fontFamily: fonts.bebas,
    fontSize: 52,
    letterSpacing: -1,
    color: colors.paper,
    lineHeight: 54,
    marginBottom: 2,
  },
  navMeta: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: 'rgba(240,237,230,0.55)',
    marginBottom: 14,
  },

  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  dotItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  dotPast: {
    backgroundColor: 'rgba(240,238,233,0.35)',
  },
  dotCurrent: {
    backgroundColor: colors.paper,
    width: DOT_SIZE + 4,
    height: DOT_SIZE + 4,
    borderRadius: (DOT_SIZE + 4) / 2,
  },
  dotFuture: {
    borderWidth: 1.5,
    borderColor: 'rgba(240,238,233,0.35)',
    backgroundColor: 'transparent',
  },
  dotLine: {
    width: DOT_LINE_W,
    height: 1.5,
    backgroundColor: 'rgba(240,238,233,0.2)',
  },
  dotLinePast: {
    backgroundColor: 'rgba(240,238,233,0.5)',
  },

  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: 'rgba(240,237,230,0.35)',
  },
  backBtnText: {
    fontFamily: fonts.oswald,
    fontSize: 18,
    color: colors.paper,
  },
  exitBtn: {
    flex: 1,
    height: 46,
  },

  // Overview panel (pre-nav)
  panelInner: { paddingBottom: 24 },

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
  closeBtn: { borderColor: 'rgba(240,238,233,0.4)' },
  closeBtnText: { fontFamily: fonts.mono, fontSize: 13, color: colors.paper },

  loadingBlock: { paddingVertical: 32, alignItems: 'center' },

  etaBlock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    gap: 20,
    marginBottom: 28,
  },
  etaTime: { letterSpacing: -1 },
  statsCols: { flexDirection: 'row', gap: 22, paddingBottom: 6 },
  statCol: { gap: 5 },

  beginBtn: { marginHorizontal: 20 },
});
