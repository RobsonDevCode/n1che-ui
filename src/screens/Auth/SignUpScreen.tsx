import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, fonts } from '../../theme';
import { RootNavigationProp } from '../../navigation/types';
import { useAppDispatch } from '../../store/hooks';
import { setUser } from '../../store/slices/authSlice';
import { signUp, confirmSignUp, resendSignUpCode, signIn, signOut, getCurrentUser } from '../../services/auth/cognito';
import { parseAuthError } from '../../utils/authErrors';
import AuthLayout from './AuthLayout';
import FormField from '../../components/common/FormField';
import Button from '../../components/Button';
import PasswordRequirements from '../../components/common/PasswordRequirements';
import { authStyles as s } from './authStyles';

export default function SignUpScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const dispatch = useAppDispatch();

  const [step, setStep] = useState<'register' | 'confirm'>('register');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setError('');
    if (!email.trim() || !username.trim() || !password || !confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    if (/\s/.test(username)) {
      setError('Username cannot contain spaces.');
      return;
    }
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username.trim())) {
      setError('Username cannot be an email address.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, username);
      setStep('confirm');
    } catch (err) {
      setError(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setLoading(true);
    try {
      await resendSignUpCode(username);
      setCode('');
    } catch (err) {
      setError(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError('');
    if (!code.trim()) {
      setError('Please enter the code.');
      return;
    }
    setLoading(true);
    try {
      await confirmSignUp(username, code);
      await signOut();
      await signIn(username, password);
      const user = await getCurrentUser();
      if (user) dispatch(setUser({ userId: user.userId, username: user.username, email: user.email }));
      navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
    } catch (err) {
      setError(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={step === 'register' ? 'SIGN UP' : 'VERIFY'}>
      {step === 'register' ? (
        <>
          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            placeholder="your@email.com"
          />

          <FormField
            label="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoComplete="username-new"
            placeholder="yourhandle"
          />

          <FormField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
            placeholder="••••••••"
          />
          <PasswordRequirements password={password} />

          <FormField
            label="Confirm Password"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            autoComplete="new-password"
            placeholder="••••••••"
          />

          {!!error && <Text style={s.error}>{error}</Text>}

          <Button variant="primary" label="Create Account →" onPress={handleSignUp} loading={loading} />

          <Button variant="link" onPress={() => navigation.navigate('Login')}>
            <Text style={s.linkText}>
              Already have an account?{'  '}
              <Text style={s.linkBold}>LOG IN</Text>
            </Text>
          </Button>
        </>
      ) : (
        <>
          <Text style={styles.confirmHeading}>Check your email.</Text>
          <Text style={styles.confirmSub}>We sent a 6-digit code to{'\n'}{email}</Text>

          <FormField
            label="Verification Code"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="000000"
            inputStyle={styles.codeInput}
          />

          {!!error && <Text style={s.error}>{error}</Text>}

          <Button variant="primary" label="Verify →" onPress={handleVerify} loading={loading} />

          <Button variant="link" onPress={handleResend} disabled={loading}>
            <Text style={s.linkText}>Didn't receive it?{'  '}<Text style={s.linkBold}>RESEND</Text></Text>
          </Button>

          <Button variant="link" onPress={() => { setStep('register'); setCode(''); }}>
            <Text style={s.linkText}>← Back</Text>
          </Button>
        </>
      )}
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  confirmHeading: {
    fontFamily: fonts.fellItalic,
    fontStyle: 'italic',
    fontSize: 28,
    color: colors.ink,
    marginBottom: 8,
  },
  confirmSub: {
    fontFamily: fonts.special,
    fontSize: 14,
    color: colors.ink2,
    lineHeight: 22,
    marginBottom: 22,
  },
  codeInput: {
    fontSize: 24,
    letterSpacing: 8,
    textAlign: 'center',
  },
});
