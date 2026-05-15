import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { colors } from '../../theme';
import HalftonePattern from '../common/HalftonePattern';
import Polaroid from '../Polaroid/Polaroid';
import Thumbtack from '../Thumbtack/Thumbtack';
import { useSplashShops } from '../../hooks/useSplashShops';

// Proportional positions (0–1) derived from original 390×520 design canvas
const PINS: { lx: number; ty: number; rot: number }[] = [
  { lx: 0.03, ty: 0.03, rot: -8  },
  { lx: 0.55, ty: 0.02, rot: 5   },
  { lx: 0.29, ty: 0.20, rot: -4  },
  { lx: 0.67, ty: 0.23, rot: 8   },
  { lx: 0.04, ty: 0.44, rot: -11 },
  { lx: 0.45, ty: 0.50, rot: 4   },
  { lx: 0.70, ty: 0.58, rot: -7  },
  { lx: 0.12, ty: 0.73, rot: 9   },
];

const TACK_SIZE = 12;

export default function CorkBoard() {
  const [dims, setDims] = useState({ w: 390, h: 440 });
  const shops = useSplashShops();

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setDims({ w: width, h: height });
  };

  return (
    <View style={styles.board} onLayout={onLayout}>
      <HalftonePattern dotColor="rgba(0,0,0,0.07)" dotRadius={0.9} spacing={5} />
      {PINS.map((pin, i) => (
        <View
          key={i}
          style={[
            styles.item,
            {
              left: pin.lx * dims.w,
              top: pin.ty * dims.h,
              transform: [{ rotate: `${pin.rot}deg` }],
            },
          ]}
        >
          <View style={styles.tack}>
            <Thumbtack index={i} size={TACK_SIZE} />
          </View>
          <Polaroid shop={shops[i % shops.length]} size="home" index={i} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
