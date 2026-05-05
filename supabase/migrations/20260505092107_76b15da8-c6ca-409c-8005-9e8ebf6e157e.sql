
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS is_read boolean NOT NULL DEFAULT false;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS favicon_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bg_home_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bg_videos_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bg_about_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bg_skills_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bg_contact_url text;

-- Allow admins to update message read state
DROP POLICY IF EXISTS "Admins update messages" ON public.contact_messages;
CREATE POLICY "Admins update messages" ON public.contact_messages
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
