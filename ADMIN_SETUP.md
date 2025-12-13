# Admin Setup Guide

This guide will help you set up admin access for the Tools Library platform.

## Quick Start: Make Yourself an Admin

### Option 1: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run one of the following queries:

**Using the helper function:**
```sql
SELECT * FROM promote_user_to_admin('your-email@example.com');
```

**Or update directly:**
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### Option 2: Using Environment Variables

Add your email to `.env.local`:

```env
ADMIN_EMAILS=your-email@example.com,another-admin@example.com
```

This allows users with these emails to access admin routes even without the admin role in the database.

### Option 3: After User Registration

If you just created an account, your profile might not exist yet. Run this to create it with admin role:

```sql
INSERT INTO public.profiles (id, email, role, created_at, updated_at)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'your-email@example.com'),
  'your-email@example.com',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin',
    updated_at = NOW();
```

## Testing Admin Access

1. **Log in** to your account with the email you promoted
2. **Visit** http://localhost:3000/admin
3. You should see the admin dashboard

If you're redirected to the login page or homepage, check:
- Your user is authenticated (check browser cookies)
- Your profile role is set to 'admin' or 'super_admin'
- Your email is in ADMIN_EMAILS env variable (if using that method)

## Admin Routes

Once you have admin access, you can access:

- `/admin` - Admin dashboard
- `/admin/tools` - Manage tools (internal & external)
- `/admin/ai-tools` - Manage AI tools
- `/admin/users` - Manage users
- `/admin/analytics` - View analytics
- `/admin/settings` - Platform settings

## Roles

The platform supports these roles:

- `user` - Regular user (default)
- `moderator` - Can moderate content
- `admin` - Full access to admin panel
- `super_admin` - Full system access (future use)

## Troubleshooting

### "Unauthorized" or "Access Denied" Errors

**Check if you're logged in:**
```sql
-- In Supabase SQL Editor, check auth.users table
SELECT id, email, created_at FROM auth.users WHERE email = 'your-email@example.com';
```

**Check your profile and role:**
```sql
SELECT * FROM public.profiles WHERE email = 'your-email@example.com';
```

**If no profile exists, create one:**
```sql
SELECT * FROM promote_user_to_admin('your-email@example.com');
```

### Admin API Returns 401/403

1. Clear browser cookies and log in again
2. Verify your session is active
3. Check browser console for detailed error messages
4. Check server logs for more details

### Middleware Redirects to Login

Ensure you're authenticated and your role is set correctly in the `profiles` table.

## Development vs Production

### Development
- Uses `ADMIN_EMAILS` env variable for quick admin access
- Middleware checks both database role AND admin emails list

### Production
- Should rely primarily on database roles
- Remove or restrict `ADMIN_EMAILS` to trusted emails only
- Enable proper user management flows

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit admin emails** to version control
2. **Use strong passwords** for admin accounts
3. **Enable MFA** (Multi-Factor Authentication) in Supabase for admin users
4. **Audit admin actions** regularly
5. **Limit admin access** to only trusted team members
6. **Rotate credentials** if compromised

## Next Steps

After setting up admin access:

1. ✅ Log in with your admin account
2. ✅ Visit `/admin/tools` to add your first external tool
3. ✅ Configure platform settings
4. ✅ Invite other team members and assign roles

---

**Need help?** Check the main README or create an issue on GitHub.
