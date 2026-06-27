import { ViewStyle } from 'react-native';

export type TooltipPosition = 'top' | 'bottom';

export interface TooltipProps {
  text: string;
  visible?: boolean;
  position?: TooltipPosition;
  style?: ViewStyle;
}
