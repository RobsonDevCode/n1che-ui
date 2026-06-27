import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme';

interface Props {
  size?: number;
  color?: string;
}

export default function MapIcon({ size = 22, color = colors.ink }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3 5l5-2v14l-5 2V5zm5-2l5 2v14l-5-2V3zm5 2l5-2v14l-5 2V5z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}
