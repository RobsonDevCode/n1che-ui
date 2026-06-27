export type SearchBarVariant = 'default' | 'ink';

export interface SearchBarProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: (text: string) => void;
  variant?: SearchBarVariant;
  loading?: boolean;
  onClear?: () => void;
}
