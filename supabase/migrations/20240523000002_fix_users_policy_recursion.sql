-- Drop the problematic policy that's causing infinite recursion
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;

-- Create a simpler policy that avoids recursion
CREATE POLICY "Users can view their own data"
ON public.users
FOR SELECT
USING (auth.uid() = id OR auth.uid() IN (
  SELECT id FROM users WHERE company_id = users.company_id AND role IN ('admin', 'pemilik')
));

-- Add a separate policy for company admins to view users in their company
DROP POLICY IF EXISTS "Company admins can view users in their company" ON public.users;
CREATE POLICY "Company admins can view users in their company"
ON public.users
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM users AS admin_user
  WHERE admin_user.id = auth.uid()
  AND admin_user.company_id = users.company_id
  AND admin_user.role IN ('admin', 'pemilik')
));
