import { useState } from 'react';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '../../navigation/types';
import { useAppDispatch } from '../../store/hooks';
import { setUser } from '../../store/slices/authSlice';
import { signIn, getCurrentUser } from '../../services/auth/cognito';
import { parseAuthError } from '../../utils/authErrors';
import AuthLayout from './AuthLayout';
import FormField from '../../components/common/FormField';
import Button from '../../components/common/Button';
import { authStyles as s } from './authStyles';

export default function LoginScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      const user = await getCurrentUser();
      if (user) dispatch(setUser({ userId: user.userId, username: user.username, email: user.email }));
      navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
    } catch (err) {
      console.error('handleLogin error:', err);
      setError(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="LOG IN">
      <FormField
        label="Email or Username"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        placeholder="your@email.com or yourhandle"
      />

      <FormField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="current-password"
        placeholder="••••••••"
      />

      {!!error && <Text style={s.error}>{error}</Text>}

      <Button variant="primary" label="Log In →" onPress={handleLogin} loading={loading} />

      <Button variant="link" onPress={() => navigation.navigate('SignUp')}>
        <Text style={s.linkText}>
          Don't have an account?{'  '}
          <Text style={s.linkBold}>SIGN UP</Text>
        </Text>
      </Button>
    </AuthLayout>
  );
}
