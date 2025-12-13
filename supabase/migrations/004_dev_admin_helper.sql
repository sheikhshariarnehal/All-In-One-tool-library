-- Helper to upgrade existing user to admin
-- This migration provides a function to promote users to admin role

-- Function to promote a user to admin by email
CREATE OR REPLACE FUNCTION promote_user_to_admin(user_email TEXT)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  user_id UUID,
  old_role TEXT,
  new_role TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_old_role TEXT;
BEGIN
  -- Find user by email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = user_email
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RETURN QUERY SELECT 
      false,
      'User not found with email: ' || user_email,
      NULL::UUID,
      NULL::TEXT,
      NULL::TEXT;
    RETURN;
  END IF;

  -- Get current role
  SELECT role INTO v_old_role
  FROM public.profiles
  WHERE id = v_user_id;

  IF v_old_role IS NULL THEN
    -- Create profile if it doesn't exist
    INSERT INTO public.profiles (id, email, role, created_at, updated_at)
    VALUES (
      v_user_id,
      user_email,
      'admin',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin',
        updated_at = NOW();
    
    RETURN QUERY SELECT 
      true,
      'Profile created and user promoted to admin',
      v_user_id,
      'user'::TEXT,
      'admin'::TEXT;
    RETURN;
  END IF;

  -- Update existing profile to admin
  UPDATE public.profiles
  SET role = 'admin',
      updated_at = NOW()
  WHERE id = v_user_id;

  RETURN QUERY SELECT 
    true,
    'User promoted to admin successfully',
    v_user_id,
    v_old_role,
    'admin'::TEXT;
  RETURN;
END;
$$;

-- Example usage (commented out - uncomment and modify with your email):
-- SELECT * FROM promote_user_to_admin('your-email@example.com');

-- For development: You can also manually update a user's role with:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';

COMMENT ON FUNCTION promote_user_to_admin IS 
'Promotes a user to admin role by email. Usage: SELECT * FROM promote_user_to_admin(''user@example.com'');';
