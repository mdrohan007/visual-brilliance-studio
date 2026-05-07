DELETE FROM auth.users WHERE id IN (SELECT user_id FROM public.user_roles);
DELETE FROM public.user_roles;

ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS is_primary boolean NOT NULL DEFAULT false;

DO $$
DECLARE uid uuid := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, is_sso_user, is_anonymous
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
    'mdrohanhere@gmail.com', crypt('rohan007@@@', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, false
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), uid,
    jsonb_build_object('sub', uid::text, 'email', 'mdrohanhere@gmail.com', 'email_verified', true),
    'email', uid::text, now(), now(), now()
  );

  -- handle_new_user trigger already inserted admin role; mark it as primary
  UPDATE public.user_roles SET is_primary = true WHERE user_id = uid AND role = 'admin';
END $$;

CREATE OR REPLACE FUNCTION public.protect_primary_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' AND OLD.is_primary THEN
    RAISE EXCEPTION 'Primary admin cannot be removed';
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.is_primary AND (NEW.role <> 'admin' OR NEW.is_primary = false) THEN
    RAISE EXCEPTION 'Primary admin cannot be modified';
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS protect_primary_admin_trg ON public.user_roles;
CREATE TRIGGER protect_primary_admin_trg
BEFORE UPDATE OR DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.protect_primary_admin();