
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import AuthForm from '@/components/auth/AuthForm';
import { authAtom, getAuthToken, getUserData } from '@/lib/auth';

const Login: React.FC = () => {
  const [authState, setAuthState] = useAtom(authAtom);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if the user is already authenticated
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
          
          // Redirect to dashboard
          navigate('/dashboard');
        } else {
          // User is not authenticated, update loading state
          setAuthState({
            ...authState,
            loading: false
          });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuthState({
          ...authState,
          loading: false,
          error: error instanceof Error ? error.message : 'Authentication check failed'
        });
      }
    };
    
    if (authState.loading) {
      checkAuth();
    } else if (authState.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [authState, setAuthState, navigate]);
  
  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  return <AuthForm />;
};

export default Login;
