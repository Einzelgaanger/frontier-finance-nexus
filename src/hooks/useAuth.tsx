
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
  signInWithGoogle: () => Promise<{ error: unknown }>;
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
      
      // First try to get the role from user_roles table
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user role:', error);
        // If there's an error, try to create a default role
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'viewer' });
        
        if (insertError) {
          console.error('Error creating default role:', insertError);
          // If we can't create a role, default to viewer
          setUserRole('viewer');
        } else {
          setUserRole('viewer');
        }
        return;
      }

      if (!data) {
        console.log('No role found, creating default viewer role');
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'viewer' });
        
        if (insertError) {
          console.error('Error creating default role:', insertError);
          setUserRole('viewer');
        } else {
          setUserRole('viewer');
        }
      } else {
        console.log('User role fetched:', data.role);
        setUserRole(data.role);
      }
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Only fetch role if user ID changed, it's a new signup, or we haven't fetched yet
          if (lastUserId !== session.user.id || event === 'SIGNED_IN' || !isFetchingRole) {
            lastUserId = session.user.id;
            
            // Clear any existing timeout
            if (roleFetchTimeout) {
              clearTimeout(roleFetchTimeout);
            }
            
            // Prevent multiple simultaneous role fetches
            if (!isFetchingRole) {
              isFetchingRole = true;
              
              // Wait for the trigger to complete if it's a new signup
              if (event === 'SIGNED_IN') {
                roleFetchTimeout = setTimeout(async () => {
                  if (mounted) {
                    await fetchUserRole(session.user.id);
                    isFetchingRole = false;
                  }
                }, 2000);
              } else {
                // Debounce role fetching to avoid multiple rapid calls
                roleFetchTimeout = setTimeout(async () => {
                  if (mounted) {
                    await fetchUserRole(session.user.id);
                    isFetchingRole = false;
                  }
                }, 500);
              }
            }
          }

          // Handle redirect after successful authentication
          if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && 
              window.location.pathname === '/auth') {
            window.location.href = '/dashboard';
          }
        } else {
          setUserRole(null);
          lastUserId = null;
          isFetchingRole = false;
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
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

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      return { error };
    } catch (error) {
      console.error('Google sign in error:', error);
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
      signInWithGoogle,
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
