import { Text, TextStyle } from 'react-native';
import { colors, fonts } from '../../theme';

interface Props {
  children: React.ReactNode;
  size?: number;
  color?: string;
  numberOfLines?: number;
  style?: TextStyle;
}

export default function Title({ children, size = 22, color = colors.ink, numberOfLines, style }: Props) {
  return (
    <Text numberOfLines={numberOfLines} style={[{ fontFamily: fonts.bebas, fontSize: size, letterSpacing: 1.5, color }, style]}>
      {children}
    </Text>
  );
}
