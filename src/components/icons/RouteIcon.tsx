import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../../theme';

interface Props {
  size?: number;
  color?: string;
}

export default function RouteIcon({ size = 22, color = colors.ink }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Start dot */}
      <Circle cx={5} cy={5} r={2.8} fill={color} />
      {/* End dot */}
      <Circle cx={19} cy={19} r={2.8} fill={color} />
      {/* Dashed curved path between them */}
      <Path
        d="M5 8C5 14 19 10 19 16"
        stroke={color}
        strokeWidth={2.5}
        strokeDasharray="3 2.5"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
