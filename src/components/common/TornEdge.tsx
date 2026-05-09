import Svg, { Path } from 'react-native-svg';
import { useWindowDimensions } from 'react-native';

const PATH_DATA = 'M0,0 L8,12 L22,4 L38,16 L52,6 L68,18 L82,5 L96,14 L112,3 L128,17 L144,7 L158,15 L174,4 L190,18 L206,8 L220,16 L236,5 L250,14 L266,6 L280,18 L296,4 L312,15 L326,7 L342,16 L358,3 L374,13 L390,5 L390,0 Z';

export default function TornEdge() {
  const { width } = useWindowDimensions();
  return (
    <Svg width={width} height={20} viewBox="0 0 390 20" preserveAspectRatio="none" style={{ display: 'flex' }}>
      <Path d={PATH_DATA} fill="#111111" />
    </Svg>
  );
}
