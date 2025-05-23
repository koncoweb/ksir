-- Add 'admingudang' to the user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admingudang';

-- Create RLS policies for the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own data
-- Safely drop policy if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Users can view their own data'
  ) THEN
    DROP POLICY "Users can view their own data" ON public.users;
  END IF;
END;
$$;
CREATE POLICY "Users can view their own data"
ON public.users
FOR SELECT
USING (auth.uid() = id);

-- Policy to allow users to update their own data (except role)
-- Safely drop policy if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Users can update their own data'
  ) THEN
    DROP POLICY "Users can update their own data" ON public.users;
  END IF;
END;
$$;
CREATE POLICY "Users can update their own data"
ON public.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND OLD.role = NEW.role);

-- Policy to allow managers and owners to view all users
-- Safely drop policy if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Managers and owners can view all users'
  ) THEN
    DROP POLICY "Managers and owners can view all users" ON public.users;
  END IF;
END;
$$;
CREATE POLICY "Managers and owners can view all users"
ON public.users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('manajer', 'pemilik')
  )
);

-- Policy to allow owners to update any user
-- Safely drop policy if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Owners can update any user'
  ) THEN
    DROP POLICY "Owners can update any user" ON public.users;
  END IF;
END;
$$;
CREATE POLICY "Owners can update any user"
ON public.users
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'pemilik'
  )
);

-- Check if the trigger function already exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'handle_new_user'
  ) THEN
    -- Create a function to automatically insert new users into the public.users table
    CREATE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.users (id, email)
      VALUES (NEW.id, NEW.email);
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  END IF;
END;
$$;

-- Check if the trigger already exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    -- Create a trigger to call the function when a new user is created
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
  END IF;
END;
$$;

-- Enable realtime for the users table
alter publication supabase_realtime add table users;