import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme';
import { PolaroidDimensions, PolaroidSize } from './types';

export const CARD_BG = '#F8F7F3';

export const POL_PALETTE = colors.polPalette;
export const POP_COLOR = colors.pop;

export const SIZE: Record<PolaroidSize, PolaroidDimensions> = {
  home: { w: 108, photoH: 76, frame: 7, capH: 32, initialSize: 34, nameSize: 9   },
  map:  { w: 48,  photoH: 32, frame: 3, capH: 13, initialSize: 15, nameSize: 5.5 },
};

export const styles = StyleSheet.create({
  card: {
    backgroundColor: CARD_BG,
  },
  cardMap: {
    borderWidth: 1,
    borderColor: '#111111',
  },
  photo: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initial: {
    fontFamily: fonts.bebas,
    color: 'rgba(255,255,255,0.16)',
    zIndex: 1,
  },
  caption: {
    backgroundColor: CARD_BG,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    gap: 1,
  },
  name: {
    fontFamily: fonts.special,
    color: '#282828',
    textAlign: 'center',
    lineHeight: 12,
  },
  sub: {
    fontFamily: fonts.mono,
    fontSize: 6.5,
    color: colors.grey,
    textAlign: 'center',
    letterSpacing: 0.06,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
