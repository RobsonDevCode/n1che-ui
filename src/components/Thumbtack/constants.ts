import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export const PIN_COLORS = colors.pinColors;
export const POP_COLOR = colors.pop;

export const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  head: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 4,
  },
  shaft: {
    width: 2,
    height: 9,
    backgroundColor: 'rgba(90,90,90,0.7)',
  },
});
