import { supabase } from './supabase';

interface ProfileData {
  fullName?: string;
  phoneNumber?: string;
}

/**
 * Update user profile information
 * This updates the user's metadata in Supabase Auth
 */
export async function updateUserProfile(data: ProfileData) {
  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: data.fullName || '',
        phone_number: data.phoneNumber || '',
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to update profile';
    return { success: false, error: errorMessage };
  }
}

/**
 * Change user password
 * Requires the current password to change to a new password
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  try {
    // First, verify the current password by attempting to refresh
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: (await supabase.auth.getSession()).data.session?.user.email || '',
      password: currentPassword,
    });

    if (verifyError) {
      return { success: false, error: 'Current password is incorrect' };
    }

    // Update to the new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      throw new Error(updateError.message);
    }

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to change password';
    return { success: false, error: errorMessage };
  }
}

/**
 * Get current user profile from auth session
 */
export async function getCurrentUserProfile() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return { success: false, error: 'No authenticated user' };
    }

    return {
      success: true,
      data: {
        email: session.user.email || '',
        fullName: session.user.user_metadata?.full_name || '',
        phoneNumber: session.user.user_metadata?.phone_number || '',
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch profile';
    return { success: false, error: errorMessage };
  }
}
