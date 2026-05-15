import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../../theme';
import { MockShop } from './mockShops';
import ShopCard from '../../components/ShopCard/ShopCard';

interface Props {
  shops: MockShop[];
  nicheLabel: string;
  onSelectShop: (shop: MockShop) => void;
}

export default function ShopList({ shops, nicheLabel, onSelectShop }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.count}>{shops.length} SHOPS NEARBY</Text>
        <Text style={styles.sort}>TOP RATED ↓</Text>
      </View>

      {shops.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>NO SHOPS NEARBY</Text>
          <Text style={styles.emptyText}>
            We don't have any {nicheLabel.toLowerCase()} shops in your area yet.{'\n'}Try searching for a location above.
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {shops.map((shop, i) => (
            <ShopCard key={shop.id} shop={shop} index={i} onPress={() => onSelectShop(shop)} />
          ))}
          <View style={{ height: Math.max(insets.bottom, 16) }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: colors.white,
    borderTopWidth: 3,
    borderTopColor: colors.ink,
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
    flexShrink: 0,
  },
  count: {
    fontFamily: fonts.bebas,
    fontSize: 15,
    letterSpacing: 1,
    color: colors.ink,
  },
  sort: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.grey,
  },
  list: { flex: 1 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 10,
  },
  emptyTitle: {
    fontFamily: fonts.bebas,
    fontSize: 22,
    letterSpacing: 1.5,
    color: colors.ink,
  },
  emptyText: {
    fontFamily: fonts.special,
    fontSize: 13,
    color: colors.grey,
    textAlign: 'center',
    lineHeight: 20,
  },
});
