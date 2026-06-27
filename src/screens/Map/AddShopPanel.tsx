import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '../../theme';
import { PlaceResult } from '../../services/maps/googlePlaces';
import Title from '../../components/common/Title';
import Button from '../../components/Button';

interface Props {
  place: PlaceResult;
  submitting: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

export default function AddShopPanel({
  place, submitting, onSubmit, onBack,
}: Props) {
  const palIdx = place.name.charCodeAt(0) % colors.polPalette.length;

  return (
    <View style={styles.container}>
      <View style={[styles.hero, { backgroundColor: colors.polPalette[palIdx] }]}>
        {place.photoUrl
          ? <Image source={{ uri: place.photoUrl }} style={styles.heroImage} resizeMode="cover" />
          : <Title size={72} color="rgba(255,255,255,0.18)">{place.name.charAt(0).toUpperCase()}</Title>
        }
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.65)']} style={styles.heroGradient} pointerEvents="none" />
        <View style={styles.heroInfo}>
          <Title size={24} color={colors.white} style={styles.shopName}>{place.name.toUpperCase()}</Title>
          <Text style={styles.shopAddr}>{place.address}</Text>
        </View>
        <Button variant="icon" onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </Button>
      </View>

      <View style={styles.actions}>
        <Button
          variant="primary"
          label="Add Shop"
          loading={submitting}
          onPress={onSubmit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: 'hidden',
  },
  hero: {
    height: 140,
    width: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  heroGradient: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  heroInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
  },
  shopName: { lineHeight: 26 },
  shopAddr: {
    fontFamily: fonts.special,
    fontSize: 12,
    color: 'rgba(255,255,255,0.72)',
  },
  backBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 0,
  },
  backBtnText: {
    fontFamily: fonts.oswald,
    fontSize: 18,
    color: colors.white,
    lineHeight: 20,
  },
  actions: { padding: 16 },
});
