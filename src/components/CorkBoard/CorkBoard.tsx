import { LayoutChangeEvent, View } from 'react-native';
import { useState } from 'react';
import HalftonePattern from '../common/HalftonePattern';
import Polaroid from '../Polaroid';
import Thumbtack from '../Thumbtack';
import { useSplashShops } from '../../hooks/useSplashShops';
import { PINS, TACK_SIZE, styles } from './constants';

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
