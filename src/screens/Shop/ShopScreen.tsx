import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSizes } from '../../theme';

export default function ShopScreen() {
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
