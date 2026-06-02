import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../../theme';

interface Props {
  variant?: 'paper' | 'ink';
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function Panel({ variant = 'paper', children, style }: Props) {
  const bg = variant === 'ink' ? colors.ink : colors.paper;
  const shadowOpacity = variant === 'ink' ? 0.3 : 0.12;

  return (
    <View style={[styles.shadow, { shadowOpacity }]}>
      <View style={[styles.inner, { backgroundColor: bg }, style]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    flex: 1,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowRadius: 20,
    elevation: 20,
  },
  inner: {
    flex: 1,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: 'hidden',
  },
});
