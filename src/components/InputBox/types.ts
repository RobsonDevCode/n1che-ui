import { StyleProp, TextInputProps, TextStyle } from 'react-native';

export type InputVariant = 'default' | 'ink';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputBoxProps extends Omit<TextInputProps, 'style'> {
  label: string;
  variant?: InputVariant;
  size?: InputSize;
  disabled?: boolean;
  issue?: boolean;
  helper?: string;
  inputStyle?: StyleProp<TextStyle>;
}
