import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme';

interface Props {
  size?: number;
  color?: string;
  filled?: boolean;
}

export default function BookmarkIcon({ size = 20, color = colors.ink, filled = false }: Props) {
  const d = 'M17 3H7a2 2 0 00-2 2v16l7-4 7 4V5a2 2 0 00-2-2z';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {filled
        ? <Path d={d} fill={color} />
        : <Path d={d} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" />
      }
    </Svg>
  );
}
