import { NavProgress } from '../../types/navigation';

export interface NavigationPromptProps {
  progress: NavProgress;
  muted: boolean;
  onToggleMute: () => void;
}
