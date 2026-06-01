import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { BudgetTier, RouteDuration, RouteFilters } from '../../types/route';
import Button from '../../components/common/Button';

const BUDGET_TIERS: BudgetTier[] = ['£', '££', '£££'];
const DURATIONS: { label: string; value: RouteDuration }[] = [
  { label: '1H',  value: 60  },
  { label: '2H',  value: 120 },
  { label: '3H+', value: 180 },
];

interface Props {
  loading: boolean;
  onFindRoute: (filters: RouteFilters) => void;
  onExit: () => void;
}

export default function RouteFilterBar({ loading, onFindRoute, onExit }: Props) {
  const [budget, setBudget]             = useState<BudgetTier | undefined>(undefined);
  const [maxRouteTime, setMaxRouteTime] = useState<RouteDuration | undefined>(undefined);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>BEST ROUTE</Text>
        <TouchableOpacity onPress={onExit} activeOpacity={0.7}>
          <Text style={styles.exitText}>← EXIT</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>BUDGET</Text>
          <View style={styles.chips}>
            {BUDGET_TIERS.map(tier => (
              <Button
                key={tier}
                variant="chip"
                label={tier}
                active={budget === tier}
                onPress={() => setBudget(budget === tier ? undefined : tier)}
              />
            ))}
          </View>
        </View>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>TIME</Text>
          <View style={styles.chips}>
            {DURATIONS.map(d => (
              <Button
                key={d.value}
                variant="chip"
                label={d.label}
                active={maxRouteTime === d.value}
                onPress={() => setMaxRouteTime(maxRouteTime === d.value ? undefined : d.value)}
              />
            ))}
          </View>
        </View>
      </View>

      <Button
        variant="primary"
        label="FIND ROUTE →"
        loading={loading}
        onPress={() => onFindRoute({ budget, maxRouteTime })}
        style={styles.findBtn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    borderTopWidth: 3,
    borderTopColor: colors.ink,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey2,
  },
  title: {
    fontFamily: fonts.bebas,
    fontSize: 20,
    letterSpacing: 2,
    color: colors.ink,
  },
  exitText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.grey,
  },
  filters: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 14,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  filterLabel: {
    fontFamily: fonts.mono,
    fontSize: 8,
    letterSpacing: 2,
    color: colors.grey,
    width: 46,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
  },
  findBtn: {
    marginHorizontal: 16,
    marginBottom: 0,
  },
});
