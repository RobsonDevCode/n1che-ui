import { Amplify } from 'aws-amplify';
import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirmSignUp,
  resendSignUpCode as amplifyResendSignUpCode,
  signOut as amplifySignOut,
  getCurrentUser as amplifyGetCurrentUser,
  fetchUserAttributes,
} from 'aws-amplify/auth';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

export function configureAmplify(): void {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: extra.cognitoUserPoolId,
        userPoolClientId: extra.cognitoClientId,
        loginWith: { email: true, username: true },
      },
    },
  });
}

export interface AuthUser {
  userId: string;
  username: string;
  email: string;
}

export async function signIn(identifier: string, password: string): Promise<void> {
  const { isSignedIn, nextStep } = await amplifySignIn({ username: identifier.trim(), password, options: { authFlowType: 'USER_PASSWORD_AUTH' } });
  if (!isSignedIn) {
    throw new Error(`sign_in_step:${nextStep.signInStep}`);
  }
}

export async function signUp(email: string, password: string, username: string): Promise<void> {
  const trimmedUsername = username.trim();
  await amplifySignUp({
    username: trimmedUsername,
    password,
    options: {
      userAttributes: {
        email: email.trim(),
        preferred_username: trimmedUsername,
      },
    },
  });
}

export async function confirmSignUp(username: string, code: string): Promise<void> {
  await amplifyConfirmSignUp({ username: username.trim(), confirmationCode: code.trim() });
}

export async function resendSignUpCode(username: string): Promise<void> {
  await amplifyResendSignUpCode({ username: username.trim() });
}

export async function signOut(): Promise<void> {
  await amplifySignOut();
}

// Returns null instead of throwing when no active session exists
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { userId } = await amplifyGetCurrentUser();
    const attrs = await fetchUserAttributes();
    return {
      userId,
      username: attrs.preferred_username ?? '',
      email: attrs.email ?? '',
    };
  } catch {
    return null;
  }
}
