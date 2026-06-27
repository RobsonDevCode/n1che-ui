import { MockShop } from '../../screens/Map/mockShops';
import { PlaceSuggestion } from '../../services/maps/googlePlaces';

export type { PlaceSuggestion };

export interface SearchDropdownProps {
  shopResults: MockShop[];
  placeResults: PlaceSuggestion[];
  onSelectShop: (shop: MockShop) => void;
  onSelectPlace: (place: PlaceSuggestion) => void;
}
