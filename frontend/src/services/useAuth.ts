import { useState, useEffect } from 'react';
import AuthService from './AuthService';

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }
  }, []);

  return currentUser;
};

export default useAuth;
