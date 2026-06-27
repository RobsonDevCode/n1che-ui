import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme';

interface Props {
  size?: number;
  color?: string;
}

export default function ListIcon({ size = 22, color = colors.ink }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3 5h18v2.5H3zm0 5.75h18v2.5H3zm0 5.75h12v2.5H3z" fill={color} />
    </Svg>
  );
}
