import { Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme';
import Title from '../common/Title';
import Subtitle from '../common/Subtitle';
import { ShopCardProps } from './types';
import { NAME_FONTS, styles } from './constants';

export default function ShopCard({ shop, index, onPress }: ShopCardProps) {
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
