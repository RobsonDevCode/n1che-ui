import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';

interface Props {
  dotColor?: string;
  dotRadius?: number;
  spacing?: number;
}

export default function HalftonePattern({
  dotColor = 'rgba(0,0,0,0.08)',
  dotRadius = 1,
  spacing = 5,
}: Props) {
  const half = spacing / 2;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern
            id="ht"
            x="0"
            y="0"
            width={spacing}
            height={spacing}
            patternUnits="userSpaceOnUse"
          >
            <Circle cx={half} cy={half} r={dotRadius} fill={dotColor} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#ht)" />
      </Svg>
    </View>
  );
}
