/*
  # Fix Profile Insert Policy

  ## Changes
  - Add policy to allow users to create their own profile on signup
  - This fixes the issue where new users cannot login because their profile creation fails

  ## Security
  - Users can only insert a profile for themselves (id must match auth.uid())
  - Existing admin policy remains for admins to create profiles for others
*/

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Keep admin ability to insert any profile
CREATE POLICY "Admins can insert any profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
