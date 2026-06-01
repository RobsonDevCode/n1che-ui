export function parseAuthError(err: unknown): string {
  if (!(err instanceof Error)) return 'Something went wrong.';
  switch (err.name) {
    case 'UserNotFoundException':       return 'Incorrect email or password.';
    case 'NotAuthorizedException':      return err.message.toLowerCase().includes('code')
      ? 'Invalid or expired code. Please try again or request a new one.'
      : 'Incorrect email or password.';
    case 'UserNotConfirmedException':   return 'Please verify your email before logging in.';
    case 'UsernameExistsException':     return 'An account with this email already exists.';
    case 'InvalidPasswordException':    return 'Password must be 8+ chars with uppercase, lowercase, number and symbol.';
    case 'CodeMismatchException':       return 'Invalid code. Please try again.';
    case 'ExpiredCodeException':        return 'Code has expired. Request a new one.';
    case 'LimitExceededException':      return 'Too many attempts. Try again later.';
    case 'UserAlreadyAuthenticatedException': return 'Already signed in. Please restart the app.';
    case 'InvalidParameterException':   return err.message.includes('password')
      ? 'Password must be 8+ chars with uppercase, lowercase, number and symbol.'
      : 'Something went wrong.';
    default:                            return 'Something went wrong.';
  }
}
