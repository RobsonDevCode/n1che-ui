import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { MockShop } from '../../screens/Map/mockShops';
import Title from '../common/Title';
import Subtitle from '../common/Subtitle';

interface Props {
  shop: MockShop;
  index: number;
  onPress: () => void;
}

const NAME_FONTS = [fonts.oswald, fonts.fellItalic] as const;

export default function ShopCard({ shop, index, onPress }: Props) {
  const isFirst = index === 0;
  const bg = index % 2 === 0 ? colors.white : colors.paper;

  return (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: bg }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.rank, isFirst && styles.rankFirst]}>
        <Title size={13} color={isFirst ? colors.white : colors.grey}>
          {String(index + 1).padStart(2, '0')}
        </Title>
      </View>

      <View style={styles.info}>
        <Text
          style={[
            styles.name,
            {
              fontFamily: NAME_FONTS[index % 2],
              fontStyle: index % 2 === 1 ? 'italic' : 'normal',
              fontWeight: index % 2 === 0 ? '700' : 'normal',
            },
          ]}
          numberOfLines={1}
        >
          {shop.name}
        </Text>
        <Text style={styles.address} numberOfLines={1}>
          {shop.address} · {shop.distanceMi}
        </Text>
      </View>

      <View style={styles.right}>
        <Title size={15} color={colors.pop}>↑{shop.voteCount}</Title>
        <View style={styles.openRow}>
          <View style={[styles.dot, { backgroundColor: shop.isOpen ? colors.ink : colors.grey2 }]} />
          <Subtitle size={8} color={shop.isOpen ? colors.ink : colors.grey2}>
            {shop.isOpen ? 'OPEN' : 'CLOSED'}
          </Subtitle>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey2,
  },

  rank: {
    width: 24,
    height: 24,
    flexShrink: 0,
    borderWidth: 2,
    borderColor: colors.grey2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankFirst: {
    backgroundColor: colors.pop,
    borderColor: colors.pop,
  },

  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    color: colors.ink,
    lineHeight: 18,
  },
  address: {
    fontFamily: fonts.special,
    fontSize: 11,
    color: colors.grey,
    marginTop: 2,
  },

  right: {
    flexShrink: 0,
    alignItems: 'flex-end',
    gap: 3,
  },
  openRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dot: {
    width: 5,
    height: 5,
  },
});
