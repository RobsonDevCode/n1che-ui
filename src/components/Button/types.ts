import { ViewStyle } from 'react-native';

export type ButtonVariant =
  | 'outline'
  | 'primary'
  | 'ghost'
  | 'action'
  | 'link'
  | 'chip'
  | 'paper'
  | 'icon'
  | 'cta'
  | 'danger'
  | 'pill'
  | 'pillFlat';

export interface ButtonProps {
  onPress: () => void;
  label?: string;
  children?: React.ReactNode;
  variant?: ButtonVariant;
  active?: boolean;
  disabled?: boolean;
  loading?: boolean;
  rotate?: number;
  style?: ViewStyle;
}
