import { Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme';
import { RouteCardProps } from './types';
import { MAX_STOPS, styles } from './constants';

export default function RouteCard({ route, rank, selected, onPress }: RouteCardProps) {
  const bg    = selected ? colors.ink  : colors.white;
  const fg    = selected ? colors.paper : colors.ink;
  const muted = selected ? 'rgba(240,237,230,0.6)' : colors.grey;
  const borderCol = selected ? 'rgba(240,237,230,0.5)' : colors.ink;

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

      {/* Stop sequence — capped at 5, remainder shown as ... */}
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
