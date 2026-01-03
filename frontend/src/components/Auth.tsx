import { Login } from './Login';
import { Register } from './Register';

interface AuthProps {
  onLoginSuccess?: () => void;
  onRegisterSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onSwitchToLogin?: () => void;
  onSkip?: () => void;
  onProductManager?: () => void;
  onSalesManager?: () => void;
  onSupportManager?: () => void;
}

export function Auth({
  onLoginSuccess,
  onRegisterSuccess,
  onSwitchToRegister,
  onSwitchToLogin,
  onSkip,
  onProductManager,
  onSalesManager,
  onSupportManager,
}: AuthProps) {
  // If we have onRegisterSuccess, show Register component
  if (onRegisterSuccess) {
    return (
      <Register
        onRegisterSuccess={onRegisterSuccess}
        onSwitchToLogin={onSwitchToLogin || (() => {})}
      />
    );
  }

  // Default to Login component
  return (
    <Login
      onLoginSuccess={onLoginSuccess || (() => {})}
      onSwitchToRegister={onSwitchToRegister || (() => {})}
      onSkip={onSkip || (() => {})}
      onProductManager={onProductManager}
      onSalesManager={onSalesManager}
      onSupportManager={onSupportManager}
    />
  );
}