import { Text, TextStyle } from 'react-native';
import { fonts } from '../../theme';

interface Props {
  children: React.ReactNode;
  style?: TextStyle;
}

export default function Tagline({ children, style }: Props) {
  return (
    <Text style={[base, style]}>
      {children}
    </Text>
  );
}

const base: TextStyle = {
  fontFamily: fonts.fellItalic,
  fontStyle: 'italic',
  lineHeight: 20,
};
