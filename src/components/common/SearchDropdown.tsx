import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { MockShop } from '../../screens/Map/mockShops';
import { PlaceSuggestion } from '../../services/maps/googlePlaces';

export type { PlaceSuggestion };

interface Props {
  shopResults: MockShop[];
  placeResults: PlaceSuggestion[];
  onSelectShop: (shop: MockShop) => void;
  onSelectPlace: (place: PlaceSuggestion) => void;
}

export default function SearchDropdown({ shopResults, placeResults, onSelectShop, onSelectPlace }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} style={styles.scroll}>
        {shopResults.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>SHOPS</Text>
            {shopResults.map(shop => (
              <TouchableOpacity key={shop.id} style={styles.row} onPress={() => onSelectShop(shop)} activeOpacity={0.7}>
                <Text style={styles.rowPrimary}>{shop.name}</Text>
                <Text style={styles.rowSecondary}>{shop.address} · {shop.distanceMi}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
        {placeResults.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>LOCATIONS</Text>
            {placeResults.map(place => (
              <TouchableOpacity key={place.placeId} style={styles.row} onPress={() => onSelectPlace(place)} activeOpacity={0.7}>
                <Text style={styles.rowPrimary}>{place.description}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: colors.ink,
    maxHeight: 260,
    zIndex: 200,
    elevation: 200,
  },
  scroll: {
    flex: 1,
  },
  sectionLabel: {
    fontFamily: fonts.mono,
    fontSize: 8,
    letterSpacing: 2,
    color: colors.grey,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
    backgroundColor: colors.paper2,
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey2,
    gap: 2,
  },
  rowPrimary: {
    fontFamily: fonts.special,
    fontSize: 13,
    color: colors.ink,
  },
  rowSecondary: {
    fontFamily: fonts.mono,
    fontSize: 8,
    letterSpacing: 1,
    color: colors.grey,
  },
});
