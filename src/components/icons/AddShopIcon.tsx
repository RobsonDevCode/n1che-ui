import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme';

interface Props {
  size?: number;
  color?: string;
}

export default function AddShopIcon({ size = 22, color = colors.ink }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Location pin */}
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill={color}
      />
      {/* Plus sign (white, centred in pin body) */}
      <Path
        d="M12 6v6M9 9h6"
        stroke="white"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}
