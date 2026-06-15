import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { RouteResponse } from '../../types/route';

interface Props {
  route: RouteResponse;
  rank: number;
  selected: boolean;
  onPress: () => void;
}

export default function RouteCard({ route, rank, selected, onPress }: Props) {
  const bg    = selected ? colors.ink  : colors.white;
  const fg    = selected ? colors.paper : colors.ink;
  const muted = selected ? 'rgba(240,237,230,0.6)' : colors.grey;
  const borderCol = selected ? 'rgba(240,237,230,0.5)' : colors.ink;

  const MAX_STOPS = 5;
  const visibleStops = route.stops.slice(0, MAX_STOPS);
  const hasMore = route.stops.length > MAX_STOPS;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: bg, borderColor: colors.ink }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Top row: rank badge + name + upvotes */}
      <View style={styles.topRow}>
        <View style={[styles.rank, { backgroundColor: fg }]}>
          <Text style={[styles.rankText, { color: bg }]}>
            {String(rank).padStart(2, '0')}
          </Text>
        </View>
        <View style={styles.nameCol}>
          <Text style={[styles.name, { color: fg }]} numberOfLines={1}>
            {route.name}
          </Text>
          <Text style={[styles.createdBy, { color: muted }]}>@{route.createdBy}</Text>
        </View>
        <View style={styles.votes}>
          <Text style={[styles.votesLabel, { color: muted }]}>UPVOTES</Text>
          <Text style={[styles.votesValue, { color: fg }]}>↑{route.totalUpvotes}</Text>
        </View>
      </View>

      {/* Stats + tag */}
      <View style={styles.statsRow}>
        <Text style={[styles.stats, { color: muted }]}>
          {route.stops.length} STOPS · {route.estimatedRouteTime} · {route.totalDistanceStr}
        </Text>
        <View style={[styles.tag, { borderColor: borderCol }]}>
          <Text style={[styles.tagText, { color: fg }]}>{route.tag}</Text>
        </View>
      </View>

      {/* Stop sequence — capped at 5, remainder shown as … */}
      <View style={styles.sequence}>
        {visibleStops.map((stop, i) => (
          <View key={stop.id} style={styles.seqItem}>
            <View style={[styles.seqDot, { backgroundColor: colors.pinColors[i % colors.pinColors.length] }]} />
            <Text style={[styles.seqName, { color: fg }]}>{stop.name}</Text>
            {i < visibleStops.length - 1 && (
              <Text style={[styles.seqArrow, { color: muted }]}>›</Text>
            )}
          </View>
        ))}
        {hasMore && (
          <>
            <Text style={[styles.seqArrow, { color: muted }]}>›</Text>
            <Text style={[styles.seqName, { color: muted }]}>…</Text>
          </>
        )}
      </View>

      {/* Showing on map — only when selected */}
      {selected && (
        <View style={styles.showingRow}>
          <View style={styles.showingDot} />
          <Text style={styles.showingText}>SHOWING ON MAP</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
