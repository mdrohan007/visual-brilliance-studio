
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS hero_banner_url text,
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS footer_text text DEFAULT '© ' || extract(year from now())::text || ' Formal Science. All rights reserved.';
