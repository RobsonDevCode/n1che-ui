import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme';

export const MAX_STOPS = 5;

export const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    padding: 13,
    marginBottom: 10,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  rank: {
    width: 26,
    height: 26,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  nameCol: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontFamily: fonts.bebas,
    fontSize: 19,
    letterSpacing: 0.5,
  },
  createdBy: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 0.5,
    marginTop: 1,
  },
  votes: {
    alignItems: 'flex-end',
    flexShrink: 0,
    gap: 1,
  },
  votesLabel: {
    fontFamily: fonts.mono,
    fontSize: 7,
    letterSpacing: 1,
  },
  votesValue: {
    fontFamily: fonts.mono,
    fontSize: 15,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 11,
  },
  stats: {
    flex: 1,
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.3,
  },
  tag: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexShrink: 0,
  },
  tagText: {
    fontFamily: fonts.mono,
    fontSize: 8,
    letterSpacing: 1,
  },

  sequence: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 5,
  },
  seqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seqDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  seqName: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    letterSpacing: 0.3,
  },
  seqArrow: {
    fontSize: 11,
  },

  showingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 11,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(240,237,230,0.2)',
  },
  showingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#3ad07a',
  },
  showingText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.paper,
  },
});
