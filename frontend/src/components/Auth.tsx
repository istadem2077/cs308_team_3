import { Login } from './Login';
import { Register } from './Register';

interface AuthProps {
  onLoginSuccess?: () => void;
  onRegisterSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onSwitchToLogin?: () => void;
  onSkip?: () => void;
  onProductManager?: () => void;
}

export function Auth({
  onLoginSuccess,
  onRegisterSuccess,
  onSwitchToRegister,
  onSwitchToLogin,
  onSkip,
  onProductManager,
}: AuthProps) {
  // If we have onRegisterSuccess, show Register component
  if (onRegisterSuccess && onSwitchToLogin) {
    return (
      <Register
        onRegisterSuccess={onRegisterSuccess}
        onSwitchToLogin={onSwitchToLogin}
        onSkip={onSkip || (() => {})}
      />
    );
  }

  // Otherwise show Login component
  return (
    <Login
      onLoginSuccess={onLoginSuccess || (() => {})}
      onSwitchToRegister={onSwitchToRegister || (() => {})}
      onSkip={onSkip || (() => {})}
      onProductManager={onProductManager}
    />
  );
}