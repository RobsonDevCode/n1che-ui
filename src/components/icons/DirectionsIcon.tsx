import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme';

interface Props {
  size?: number;
  color?: string;
}

export default function DirectionsIcon({ size = 20, color = colors.ink }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 3L21 12 12 21 3 12z" fill={color} />
      <Path d="M8 10.5h5V9l4 3-4 3v-1.5H8z" fill="white" />
    </Svg>
  );
}
