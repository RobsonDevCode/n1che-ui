import { MockShop } from '../../screens/Map/mockShops';

export interface ShopCardProps {
  shop: MockShop;
  index: number;
  onPress: () => void;
}
