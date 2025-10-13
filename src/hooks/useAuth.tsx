
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: unknown }>;
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<{ error: unknown }>;
  signOut: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<{ error: unknown }>;
  resetPassword: (email: string) => Promise<{ error: unknown }>;
  refreshUserRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching user role for:', userId);
      
      // Use the safe SECURITY DEFINER function to get role (bypasses RLS)
      const { data, error } = await supabase
        .rpc('get_user_role_safe', { user_uuid: userId });

      if (error) {
        console.error('Error fetching user role:', error);
        setUserRole('viewer');
        return;
      }

      const role = data || 'viewer';
      console.log('User role fetched:', role);
      setUserRole(role);
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      setUserRole('viewer');
    }
  };

  const refreshUserRole = async () => {
    if (user?.id) {
      await fetchUserRole(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;
    let roleFetchTimeout: NodeJS.Timeout;
    let lastUserId: string | null = null;
    let isFetchingRole = false;
    let lastFetchTime = 0;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const now = Date.now();
          const timeSinceLastFetch = now - lastFetchTime;
          
          // Only fetch role if:
          // 1. User ID changed
          // 2. It's a new signup (SIGNED_IN)
          // 3. We haven't fetched yet
          // 4. It's been more than 5 seconds since last fetch (increased)
          if (lastUserId !== session.user.id || 
              event === 'SIGNED_IN' || 
              !isFetchingRole ||
              timeSinceLastFetch > 5000) {
            
            lastUserId = session.user.id;
            
            // Clear any existing timeout
            if (roleFetchTimeout) {
              clearTimeout(roleFetchTimeout);
            }
            
            // Prevent multiple simultaneous role fetches
            if (!isFetchingRole) {
              isFetchingRole = true;
              lastFetchTime = now;
              
              // Wait for the trigger to complete if it's a new signup
              if (event === 'SIGNED_IN') {
                roleFetchTimeout = setTimeout(async () => {
                  if (mounted) {
                    await fetchUserRole(session.user.id);
                    isFetchingRole = false;
                  }
                }, 3000); // Increased wait time
              } else {
                // Debounce role fetching to avoid multiple rapid calls
                roleFetchTimeout = setTimeout(async () => {
                  if (mounted) {
                    await fetchUserRole(session.user.id);
                    isFetchingRole = false;
                  }
                }, 2000); // Increased debounce time
              }
            }
          }

          // Handle redirect after successful authentication
          if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && 
              window.location.pathname === '/auth') {
            // Redirect members to network, others to dashboard
            const redirectPath = userRole === 'member' ? '/network' : '/dashboard';
            window.location.href = redirectPath;
          }
        } else {
          setUserRole(null);
          lastUserId = null;
          isFetchingRole = false;
          lastFetchTime = 0;
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user && !isFetchingRole) {
            lastUserId = session.user.id;
            isFetchingRole = true;
            // Debounce the initial role fetch
            roleFetchTimeout = setTimeout(async () => {
              if (mounted) {
                await fetchUserRole(session.user.id);
                isFetchingRole = false;
              }
            }, 500);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in checkSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
      if (roleFetchTimeout) {
        clearTimeout(roleFetchTimeout);
      }
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Supabase auth error:', error);
        // Handle specific error types
        if (error.message.includes('500')) {
          console.error('Server error (500) - This might be a Supabase service issue');
        }
      } else {
        console.log('Sign in successful:', data);
      }
      
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: metadata,
        }
      });
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const signInWithMagicLink = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      return { error };
    } catch (error) {
      console.error('Magic link sign in error:', error);
      return { error };
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      userRole,
      loading,
      signIn,
      signUp,
      signOut,
      signInWithMagicLink,
      resetPassword,
      refreshUserRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
