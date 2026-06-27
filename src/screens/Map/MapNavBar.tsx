import { StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme';
import Button from '../../components/Button';

export interface NavBarItem {
  icon: React.ReactNode;
  onPress: () => void;
  active?: boolean;
}

interface Props {
  items: NavBarItem[];
  style?: ViewStyle;
}

export default function MapNavBar({ items, style }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.shadow, style]}>
      <View style={[styles.inner, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {items.map((item, index) => (
          <Button
            key={index}
            variant="pillFlat"
            active={item.active}
            onPress={item.onPress}
            style={styles.item}
          >
            {item.icon}
          </Button>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 20,
  },
  inner: {
    flexDirection: 'row',
    backgroundColor: colors.ink,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 10,
  },
  item: { flex: 1 },
});
