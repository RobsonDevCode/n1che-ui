import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SearchBarProps } from './types';
import { CONTAINER, ICON, INPUT, PLACEHOLDER_COLOR, styles } from './constants';

export default function SearchBar({
  placeholder, value, onChangeText, onSubmit,
  variant = 'default', loading = false, onClear,
}: SearchBarProps) {
  const showClear = value.length > 0 && onClear;
  const clearColor = variant === 'ink' ? 'rgba(240,237,230,0.5)' : '#8A8680';

  return (
    <View style={CONTAINER[variant]}>
      {loading
        ? <ActivityIndicator size="small" color={ICON[variant].color as string} />
        : <Text style={ICON[variant]}>⌕</Text>
      }
      <TextInput
        style={INPUT[variant]}
        placeholder={placeholder}
        placeholderTextColor={PLACEHOLDER_COLOR[variant]}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={() => onSubmit(value)}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {showClear && (
        <TouchableOpacity onPress={onClear} style={styles.clearBtn} activeOpacity={0.6}>
          <Text style={[styles.clearText, { color: clearColor }]}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
