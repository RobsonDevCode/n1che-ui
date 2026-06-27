import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HalftonePattern from '../common/HalftonePattern';
import { PolaroidProps } from './types';
import { SIZE, POL_PALETTE, POP_COLOR, styles } from './constants';

export default function Polaroid({ shop, size, index, selected = false, onImageLoad }: PolaroidProps) {
  const d = SIZE[size];
  const bg = POL_PALETTE[index % POL_PALETTE.length];
  const initial = shop.name.charAt(0).toUpperCase();
  const isMap = size === 'map';
  const totalH = d.frame + d.photoH + d.capH;
  // cardMap adds 1px border on all sides; border-box means top+bottom borders
  // consume 2px of the specified height, so add them back to keep content correct
  const cardH = totalH + (isMap ? 2 : 0);

  return (
    <View style={[
      styles.card,
      isMap && styles.cardMap,
      {
        width: d.w,
        height: cardH,
        shadowColor: '#000',
        shadowOpacity: isMap ? 0.65 : (selected ? 0.8 : 0.45),
        shadowRadius: isMap ? 6 : 22,
        shadowOffset: isMap ? { width: 1, height: 3 } : { width: 3, height: 8 },
        elevation: selected ? 12 : (isMap ? 8 : 6),
      },
    ]}>
      {/* White frame: top + sides */}
      <View style={{ paddingTop: d.frame, paddingHorizontal: d.frame }}>
        {/* Photo */}
        <View style={[styles.photo, { height: d.photoH, backgroundColor: bg }]}>
          <Text style={[styles.initial, { fontSize: d.initialSize }]}>{initial}</Text>
          {shop.photoUrl && (
            <Image source={{ uri: shop.photoUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" onLoad={onImageLoad} />
          )}

          <HalftonePattern dotColor="rgba(255,255,255,0.13)" dotRadius={0.8} spacing={4} />

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.20)']}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          {Array.from({ length: size === 'home' ? 7 : 4 }).map((_, i, arr) => (
            <View
              key={i}
              pointerEvents="none"
              style={{
                position: 'absolute', left: 0, right: 0,
                top: `${Math.round((i / arr.length) * 100)}%`,
                height: 1, backgroundColor: 'rgba(255,255,255,0.07)', zIndex: 4,
              }}
            />
          ))}
        </View>
      </View>

      {/* Caption strip */}
      <View style={[styles.caption, { height: d.capH }]}>
        <Text style={[styles.name, { fontSize: d.nameSize }]} numberOfLines={1}>
          {shop.name}
        </Text>
        {size === 'home' && (
          <Text style={styles.sub} numberOfLines={1}>
            {shop.address.split(',')[0]}
          </Text>
        )}
        {size === 'map' && selected && (
          <View style={[styles.dot, { backgroundColor: POP_COLOR }]} />
        )}
      </View>
    </View>
  );
}
