import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Hook to protect routes that require authentication
 * Redirects to login page if user is not authenticated
 * Preserves the intended destination for redirect after login
 */
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Save the current location so we can redirect back after login
      navigate('/auth/login', {
        replace: true,
        state: { from: location.pathname + location.search },
      });
    }
  }, [user, loading, navigate, location]);

  return { user, loading };
}

/**
 * Hook to redirect authenticated users away from auth pages
 * Useful for login/signup pages - if user is already logged in, send them to home
 */
export function useRedirectIfAuthenticated(redirectTo: string = '/') {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user) {
      // Check if there's a "from" location to redirect to
      const from = (location.state as { from?: string })?.from || redirectTo;
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location, redirectTo]);

  return { user, loading };
}
