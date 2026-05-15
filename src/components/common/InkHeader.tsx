import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme';

export default function InkHeader({ children }: { children: React.ReactNode }) {
  const { top } = useSafeAreaInsets();
  return (
    <View style={{ backgroundColor: colors.ink, paddingTop: top }}>
      {children}
    </View>
  );
}
