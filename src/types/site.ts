export type Profile = {
  id: string;
  display_name: string;
  title: string;
  bio: string | null;
  email: string | null;
  whatsapp: string | null;
  avatar_url: string | null;
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
