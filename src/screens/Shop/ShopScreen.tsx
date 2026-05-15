import { StyleSheet, Text, View } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { colors, fonts, fontSizes } from '../../theme';
import { RootStackParamList } from '../../navigation/types';

type ShopRoute = RouteProp<RootStackParamList, 'Shop'>;

export default function ShopScreen() {
  const route = useRoute<ShopRoute>();
  const { shopId: _shopId } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Shop</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: fonts.special,
    fontSize: fontSizes.body,
    color: colors.ink,
  },
});
