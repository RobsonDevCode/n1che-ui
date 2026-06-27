import { Text, View } from 'react-native';
import { TooltipProps } from './types';
import { BUBBLE, TEXT, INFO_ICON, styles } from './constants';

export default function Tooltip({
  text, visible = true, position = 'bottom', style,
}: TooltipProps) {
  if (!visible) return null;

  return (
    <View style={[styles.wrapper, style]}>
      {position === 'bottom' && <View style={styles.caretTop} />}
      <View style={BUBBLE}>
        <Text style={INFO_ICON}>ⓘ</Text>
        <Text style={TEXT}>{text}</Text>
      </View>
      {position === 'top' && <View style={styles.caretBottom} />}
    </View>
  );
}
