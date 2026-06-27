import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme';

export const PIN_COLORS = [
  { face: '#c43a2f', edge: '#7a1f17' },
  { face: '#2a5e8c', edge: '#173a55' },
  { face: '#2f7a4a', edge: '#1a4a2a' },
  { face: '#b8742a', edge: '#6e4214' },
  { face: '#8a2840', edge: '#4d1424' },
];

export const TILTS = [-2.5, 1.5, -1.5, 2.0, -1.0, 1.0, -2.0, 2.5];

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderWidth: 1.5,
    borderColor: colors.ink,
    backgroundColor: colors.ink,
  },
  cardSelected: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 6,
  },
  badge: {
    backgroundColor: colors.paper,
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRightWidth: 1,
    borderRightColor: colors.ink,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeSelected: {
    backgroundColor: colors.ink,
  },
  badgeText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: colors.ink,
  },
  badgeTextSelected: {
    color: colors.paper,
  },
  nameText: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: colors.paper,
    paddingHorizontal: 9,
    paddingVertical: 4,
    textTransform: 'uppercase',
  },
  nameTextSelected: {
    color: colors.paper,
  },
  stem: {
    width: 1.5,
    height: 14,
    backgroundColor: colors.ink,
  },
  pinHead: {
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 2,
    marginTop: -2,
  },
});
