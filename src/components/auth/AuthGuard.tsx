
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authAtom, getAuthToken, getUserData } from '@/lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [authState, setAuthState] = useAtom(authAtom);
  const [checking, setChecking] = useState<boolean>(true);
  const location = useLocation();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is already authenticated in state
        if (authState.isAuthenticated) {
          setChecking(false);
          return;
        }
        
        // Check for token and user data
        const token = await getAuthToken();
        const userData = await getUserData();
        
        if (token && userData) {
          // Update auth state
          setAuthState({
            isAuthenticated: true,
            user: userData,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setChecking(false);
      }
    };
    
    checkAuth();
  }, [authState.isAuthenticated, setAuthState]);
  
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!authState.isAuthenticated) {
    // Redirect to login but save the location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default AuthGuard;
