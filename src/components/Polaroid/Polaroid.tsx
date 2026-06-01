import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '../../theme';
import HalftonePattern from '../common/HalftonePattern';
import { ShopDisplay } from '../../types/shopDisplay';

interface PolaroidProps {
  shop: ShopDisplay;
  size: 'home' | 'map';
  index: number;
  selected?: boolean;
  onImageLoad?: () => void;
}

const CARD_BG = '#F8F7F3';

// frame = white border around the photo (sides + top)
// capH  = caption strip height (bottom, thicker — classic polaroid)
const HOME = { w: 108, photoH: 76, frame: 7, capH: 32, initialSize: 34, nameSize: 9   };
const MAP  = { w: 48,  photoH: 32, frame: 3, capH: 13, initialSize: 15, nameSize: 5.5 };

export default function Polaroid({ shop, size, index, selected = false, onImageLoad }: PolaroidProps) {
  const d = size === 'home' ? HOME : MAP;
  const bg = colors.polPalette[index % colors.polPalette.length];
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
          <View style={[styles.dot, { backgroundColor: colors.pop }]} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
