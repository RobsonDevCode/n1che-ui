import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme';

export const METERS_PER_KM = 1000;

export const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

export const styles = StyleSheet.create({
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
