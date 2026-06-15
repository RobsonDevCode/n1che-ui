import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../../theme';
import Button from '../common/Button';
import { NavProgress, NavState } from '../../types/navigation';
import { MANEUVER_ICON } from '../../constants/navigation';

interface Props {
  progress: NavProgress;
  muted: boolean;
  onToggleMute: () => void;
}

const METERS_PER_KM = 1000;

function formatDist(meters: number): string {
  if (!isFinite(meters)) return '';
  if (meters >= METERS_PER_KM) return `${(meters / METERS_PER_KM).toFixed(1)} KM`;
  return `${Math.round(meters)} M`;
}

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

function headingToCompass(h: number): string {
  if (h < 0) return '';
  return COMPASS[Math.round(h / 45) % 8];
}

export default function NavigationPrompt({ progress, muted, onToggleMute }: Props) {
  const insets = useSafeAreaInsets();

  const isRerouting = progress.state === NavState.Rerouting;

  const icon     = MANEUVER_ICON[progress.currentManeuver] ?? '↑';
  const nextIcon = progress.nextManeuver ? (MANEUVER_ICON[progress.nextManeuver] ?? '↑') : null;

  const displayDist = isFinite(progress.distanceToNextTurnMeters)
    ? progress.distanceToNextTurnMeters
    : progress.distanceToNextStopMeters;

  const distStr  = formatDist(displayDist);
  const compass  = headingToCompass(progress.currentHeading);
  const metaLine = [distStr, compass ? `HEAD ${compass}` : ''].filter(Boolean).join(' · ');

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>

      <View style={styles.topRow}>
        <Text style={styles.meta}>{isRerouting ? 'RECALCULATING…' : metaLine}</Text>
        <Button variant="ghost" onPress={onToggleMute} style={styles.muteBtn}>
          <Text style={[styles.muteBtnText, muted && styles.muteBtnTextOff]}>
            {muted ? '×SFX' : 'SFX'}
          </Text>
        </Button>
      </View>

      <View style={styles.mainRow}>
        <View style={styles.arrowWrap}>
          <Text style={styles.arrow}>{icon}</Text>
        </View>
        <Text style={styles.instruction} numberOfLines={2}>
          {progress.currentInstruction.toUpperCase()}
        </Text>
      </View>

      {!isRerouting && nextIcon && progress.nextInstruction ? (
        <View style={styles.thenRow}>
          <Text style={styles.thenLabel}>THEN</Text>
          <Text style={styles.thenIcon}>{nextIcon}</Text>
          <Text style={styles.thenInstruction} numberOfLines={1}>
            {progress.nextInstruction.toUpperCase()}
          </Text>
        </View>
      ) : null}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.ink,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  meta: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.5,
    color: 'rgba(240,237,230,0.55)',
  },
  muteBtn: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(240,237,230,0.3)',
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  muteBtnText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 1,
    color: colors.paper,
  },
  muteBtnTextOff: {
    color: 'rgba(240,237,230,0.35)',
  },

  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 8,
  },
  arrowWrap: {
    width: 44,
    height: 44,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  arrow: {
    fontSize: 24,
    color: colors.ink,
  },
  instruction: {
    flex: 1,
    fontFamily: fonts.bebas,
    fontSize: 28,
    letterSpacing: 0.5,
    color: colors.paper,
    lineHeight: 30,
  },

  thenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  thenLabel: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 1.5,
    color: 'rgba(240,237,230,0.45)',
  },
  thenIcon: {
    fontSize: 13,
    color: 'rgba(240,237,230,0.7)',
  },
  thenInstruction: {
    flex: 1,
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.5,
    color: 'rgba(240,237,230,0.7)',
  },
});
