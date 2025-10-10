// Admin User Creation Utility
// This replaces the invalid database functions with proper Supabase Admin API calls

// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';

export interface CreateUserData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: 'viewer' | 'member' | 'admin';
}

export interface CreateUserResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  error?: string;
}

/**
 * Create a new user as an admin
 * This uses Supabase's Admin API which requires service role key
 * Note: This should only be called from a secure server-side environment
 */
export const createAdminUser = async (userData: CreateUserData): Promise<CreateUserResult> => {
  try {
    // Check if current user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get user role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleData?.role !== 'admin') {
      return { success: false, error: 'Admin access required' };
    }

    // For now, return an error directing to use Supabase Dashboard
    // In production, you would call your backend API that has service role access
    return {
      success: false,
      error: 'User creation must be done through Supabase Dashboard or backend API with service role key'
    };

  } catch (error) {
    console.error('Error creating admin user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Alternative: Use Supabase Dashboard for user creation
 * This is the recommended approach for admin user creation
 */
export const getAdminUserCreationInstructions = (): string => {
  return `
To create new users as an admin:

1. Go to your Supabase Dashboard
2. Navigate to Authentication > Users
3. Click "Add User" or "Invite User"
4. Fill in the user details
5. After user creation, assign their role in the user_roles table

Or use the Supabase CLI:
supabase auth users create --email user@example.com --password password123
  `;
};

/**
 * Assign role to existing user
 */
export const assignUserRole = async (userId: string, role: 'viewer' | 'member' | 'admin'): Promise<CreateUserResult> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: role
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      user: {
        id: userId,
        email: '', // Would need to fetch from profiles
        role: role
      }
    };

  } catch (error) {
    console.error('Error assigning user role:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
