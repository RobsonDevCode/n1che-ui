import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme';
import AuthHeader from './AuthHeader';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function AuthLayout({ title, children }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <AuthHeader title={title} />
      <View style={styles.separator} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.form, { paddingBottom: Math.max(insets.bottom, 24) }]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink },
  separator: { height: 4, backgroundColor: colors.pop, flexShrink: 0 },
  scroll: { flex: 1, backgroundColor: colors.paper },
  form: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
});
