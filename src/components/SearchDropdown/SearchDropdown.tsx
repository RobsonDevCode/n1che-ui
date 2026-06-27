import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SearchDropdownProps } from './types';
import { styles } from './constants';

export default function SearchDropdown({ shopResults, placeResults, onSelectShop, onSelectPlace }: SearchDropdownProps) {
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
