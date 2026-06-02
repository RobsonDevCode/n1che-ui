import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../../theme';
import { MockShop } from './mockShops';
import ShopCard from '../../components/ShopCard/ShopCard';
import Panel from '../../components/common/Panel';
import Title from '../../components/common/Title';

interface Props {
  shops: MockShop[];
  nicheLabel: string;
  onSelectShop: (shop: MockShop) => void;
}

export default function ShopList({ shops, nicheLabel, onSelectShop }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Panel variant="paper">
      <View style={styles.header}>
        <Title size={20} color={colors.ink}>{shops.length} SHOPS NEARBY</Title>
      </View>

      {shops.length === 0 ? (
        <View style={styles.empty}>
          <Title size={22} color={colors.ink}>NO SHOPS NEARBY</Title>
          <Text style={styles.emptyText}>
            We don't have any {nicheLabel.toLowerCase()} shops in your area yet.{'\n'}Try searching for a location above.
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={shops}
          keyExtractor={shop => shop.id}
          renderItem={({ item, index }) => (
            <ShopCard shop={item} index={index} onPress={() => onSelectShop(item)} />
          )}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: Math.max(insets.bottom, 16) }} />}
        />
      )}
    </Panel>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
    flexShrink: 0,
  },
  list: { flex: 1 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 10,
  },
  emptyText: {
    fontFamily: fonts.special,
    fontSize: 13,
    color: colors.grey,
    textAlign: 'center',
    lineHeight: 20,
  },
});
