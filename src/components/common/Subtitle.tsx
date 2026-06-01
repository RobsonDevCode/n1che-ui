import { Text, TextStyle } from 'react-native';
import { colors, fonts } from '../../theme';

interface Props {
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: TextStyle;
}

export default function Subtitle({ children, size = 9, color = colors.grey, style }: Props) {
  return (
    <Text style={[{ fontFamily: fonts.mono, fontSize: size, letterSpacing: 1.5, color }, style]}>
      {children}
    </Text>
  );
}
