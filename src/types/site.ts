export type Profile = {
  id: string;
  display_name: string;
  title: string;
  bio: string | null;
  email: string | null;
  whatsapp: string | null;
  avatar_url: string | null;
  hero_banner_url?: string | null;
  logo_url?: string | null;
  footer_text?: string | null;
  favicon_url?: string | null;
  bg_home_url?: string | null;
  bg_videos_url?: string | null;
  bg_about_url?: string | null;
  bg_skills_url?: string | null;
  bg_contact_url?: string | null;
};

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  visible: boolean;
  sort_order: number;
};

export type Skill = {
  id: string;
  name: string;
  icon_key: string;
  years: number;
  visible: boolean;
  sort_order: number;
};

export type Photo = {
  id: string;
  title: string | null;
  image_url: string;
  storage_path: string | null;
  sort_order: number;
};

export type Video = {
  id: string;
  title: string | null;
  category: "premium" | "standard";
  source: "file" | "youtube";
  url: string;
  thumbnail_url: string | null;
  storage_path: string | null;
  sort_order: number;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
};
