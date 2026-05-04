import { Film, Image as ImageIcon, Layers, Wand2, Palette, Facebook, Youtube, Linkedin, HardDrive } from "lucide-react";

export const skillIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  after_effects: Wand2,
  premiere_pro: Film,
  photoshop: ImageIcon,
  capcut: Layers,
  illustrator: Palette,
};

export const skillColor: Record<string, string> = {
  after_effects: "from-violet-500 to-fuchsia-500",
  premiere_pro: "from-indigo-500 to-purple-600",
  photoshop: "from-blue-500 to-indigo-600",
  capcut: "from-cyan-400 to-blue-500",
  illustrator: "from-orange-500 to-amber-500",
};

export const socialIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  google_drive: HardDrive,
};

export const socialLabel: Record<string, string> = {
  facebook: "Facebook",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  google_drive: "Google Drive",
};
