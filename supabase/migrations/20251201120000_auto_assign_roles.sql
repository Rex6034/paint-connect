-- Automatically assign roles to newly created users
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'
  ) INTO admin_exists;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN admin_exists THEN 'user' ELSE 'admin' END)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS handle_new_user_role_trigger ON auth.users;

CREATE TRIGGER handle_new_user_role_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_role();

-- Backfill roles for existing users
WITH admin_check AS (
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'
  ) AS has_admin
)
INSERT INTO public.user_roles (user_id, role)
SELECT users.id,
  CASE
    WHEN admin_check.has_admin THEN 'user'::public.app_role
    ELSE 'admin'::public.app_role
  END
FROM auth.users AS users, admin_check
WHERE NOT EXISTS (
  SELECT 1
  FROM public.user_roles roles
  WHERE roles.user_id = users.id
)
ON CONFLICT (user_id, role) DO NOTHING;

