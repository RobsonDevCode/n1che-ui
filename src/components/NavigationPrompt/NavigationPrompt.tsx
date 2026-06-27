import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../Button';
import { NavState } from '../../types/navigation';
import { MANEUVER_ICON } from '../../constants/navigation';
import { NavigationPromptProps } from './types';
import { styles, METERS_PER_KM, COMPASS } from './constants';

function formatDist(meters: number): string {
  if (!isFinite(meters)) return '';
  if (meters >= METERS_PER_KM) return `${(meters / METERS_PER_KM).toFixed(1)} KM`;
  return `${Math.round(meters)} M`;
}

function headingToCompass(h: number): string {
  if (h < 0) return '';
  return COMPASS[Math.round(h / 45) % 8];
}

export default function NavigationPrompt({ progress, muted, onToggleMute }: NavigationPromptProps) {
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
