import { View } from 'react-native';
import { PanelProps } from './types';
import { VARIANT_BG, VARIANT_SHADOW_OPACITY, styles } from './constants';

export default function Panel({ variant = 'paper', children, style }: PanelProps) {
  const bg = VARIANT_BG[variant];
  const shadowOpacity = VARIANT_SHADOW_OPACITY[variant];

  return (
    <View style={[styles.shadow, { shadowOpacity }]}>
      <View style={[styles.inner, { backgroundColor: bg }, style]}>
        {children}
      </View>
    </View>
  );
}
