import { ViewStyle } from 'react-native';

export type PanelVariant = 'paper' | 'ink';

export interface PanelProps {
  variant?: PanelVariant;
  children: React.ReactNode;
  style?: ViewStyle;
}
