# Admin Dashboard Data Issues - Fixed

## Issues Found in Your Dashboard

Based on the data you showed me:

### ❌ **Total Users: 0** (INCORRECT)
**Problem**: The `user_roles` table query is returning 0 results due to RLS (Row Level Security) policies blocking admin access.

**Root Cause**: The RLS policy on `user_roles` only allows users to view their own role. There's no policy allowing admins to view all user roles.

**Fix Applied**: 
- Added fallback to use `profiles` table count when `user_roles` returns empty
- Added error logging to identify the issue
- Added warning message when RLS blocks the query

### ❌ **Active Members: 0 with NaN%** (INCORRECT)
**Problem**: Division by zero when calculating percentage (0 members / 0 users = NaN).

**Fix Applied**:
- Added check: `totalUsers > 0 ? Math.round((activeMembers / totalUsers) * 100) : 0`
- Changed display to show "No users yet" instead of NaN when there are no users

### ✅ **Survey Responses: 252** (CORRECT)
This is accurate - it's correctly summing all 4 year-specific survey tables.

### ✅ **Pending Applications: 0** (CORRECT)
This appears to be accurate based on the data source.

### ✅ **Recent Activity** (CORRECT)
The survey activity logs are displaying correctly with proper timestamps and details.

## Permanent Fix Needed

You need to add an RLS policy to allow admins to view all user_roles. Run this SQL in your Supabase SQL Editor:

```sql
-- Add RLS policy to allow admins to view all user_roles
CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);
```

**Note**: This policy uses a subquery to check if the current user is an admin. This is safe because:
1. It only grants SELECT (read) access
2. It checks the user's role in the same table
3. Only admins can see this data

## What Was Fixed in Code

1. ✅ Fixed NaN division by zero error
2. ✅ Added fallback to use `profiles` count when `user_roles` is blocked
3. ✅ Added error logging to help debug RLS issues
4. ✅ Changed `assigned_at` to `created_at` to match the actual table schema
5. ✅ Added comprehensive error handling and logging

## Expected Results After Fixes

- **Total Users**: Should now show the count from `profiles` table (fallback) until RLS policy is fixed
- **Active Members**: Should show 0% instead of NaN when there are no users
- **Survey Responses**: Already correct at 252
- **Pending Applications**: Already correct at 0

## Next Steps

1. **Apply the RLS policy fix** (SQL above) to allow admins to view all user_roles
2. **Refresh the admin dashboard** - you should see correct user counts
3. **Check browser console** - the error logs will help identify any remaining issues

## Testing

After applying the RLS fix, you should see:
- Total Users showing the actual number of users in the system
- Active Members showing the correct percentage (not NaN)
- All other metrics should remain accurate

