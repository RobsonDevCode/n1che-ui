import { StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { PinPosition } from './types';

// Proportional positions (0-1) derived from original 390x520 design canvas
export const PINS: PinPosition[] = [
  { lx: 0.03, ty: 0.03, rot: -8  },
  { lx: 0.55, ty: 0.02, rot: 5   },
  { lx: 0.29, ty: 0.20, rot: -4  },
  { lx: 0.67, ty: 0.23, rot: 8   },
  { lx: 0.04, ty: 0.44, rot: -11 },
  { lx: 0.45, ty: 0.50, rot: 4   },
  { lx: 0.70, ty: 0.58, rot: -7  },
  { lx: 0.12, ty: 0.73, rot: 9   },
];

export const TACK_SIZE = 12;

export const styles = StyleSheet.create({
  board: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.paper2,
    overflow: 'hidden',
  },
  item: {
    position: 'absolute',
    alignItems: 'center',
  },
  tack: {
    marginBottom: -(TACK_SIZE / 2 + 7),
    zIndex: 1,
  },
});
