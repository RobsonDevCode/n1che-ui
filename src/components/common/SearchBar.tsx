import { StyleSheet, TextInput, View, Text } from 'react-native';
import { colors, fonts } from '../../theme';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: (text: string) => void;
}

export default function SearchBar({ placeholder, value, onChangeText, onSubmit }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⌕</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.grey}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={() => onSubmit(value)}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
  },
  icon: {
    fontFamily: fonts.special,
    fontSize: 18,
    color: colors.grey,
    lineHeight: 20,
  },
  input: {
    flex: 1,
    fontFamily: fonts.special,
    fontSize: 13,
    color: colors.ink,
    padding: 0,
  },
});
