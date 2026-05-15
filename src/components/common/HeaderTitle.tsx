import { Text, TextStyle } from 'react-native';
import { colors, fonts } from '../../theme';

interface Props {
  children: React.ReactNode;
  style?: TextStyle;
}

export default function HeaderTitle({ children, style }: Props) {
  return (
    <Text style={[base, style]}>
      {children}
    </Text>
  );
}

const base: TextStyle = {
  fontFamily: fonts.bebas,
  color: colors.white,
};
