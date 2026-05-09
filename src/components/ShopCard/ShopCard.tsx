import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts, fontSizes, spacing } from '../../theme';
import { Shop } from '../../types/shop';
import Tag from '../common/Tag';

interface ShopCardProps {
  shop: Shop;
  index: number;
  onPress: () => void;
}

export default function ShopCard({ shop, index, onPress }: ShopCardProps) {
  const isEven = index % 2 === 0;
  const nameFont = index % 2 === 0 ? fonts.bebas : fonts.fellItalic;
  const bg = isEven ? colors.white : colors.paper2;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.row, { backgroundColor: bg }]} activeOpacity={0.7}>
      <View style={styles.info}>
        <Text style={[styles.name, { fontFamily: nameFont }]}>{shop.name}</Text>
        <Text style={styles.address} numberOfLines={1}>{shop.address}</Text>
      </View>
      <View style={styles.right}>
        <Tag label={shop.niche} />
        <Text style={styles.votes}>{shop.voteCount}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey2,
  },
  info: {
    flex: 1,
    marginRight: spacing.sm,
  },
  name: {
    fontSize: fontSizes.body,
    color: colors.ink,
  },
  address: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.micro,
    color: colors.grey,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  votes: {
    fontFamily: fonts.bebas,
    fontSize: fontSizes.small,
    color: colors.ink2,
  },
});
