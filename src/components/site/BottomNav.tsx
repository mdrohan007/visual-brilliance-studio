import { Home, Film, User, Sparkles, Mail, Sun, Moon, Shield } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export type Section = "home" | "videos" | "about" | "skills" | "contact";

const items: { id: Section; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "videos", icon: Film, label: "Videos" },
  { id: "about", icon: User, label: "About" },
  { id: "skills", icon: Sparkles, label: "Skills" },
  { id: "contact", icon: Mail, label: "Contact" },
];

export const BottomNav = ({ active, onNavigate }: { active: Section; onNavigate: (id: Section) => void }) => {
  const { theme, toggle } = useTheme();
  const { isAdmin } = useAuth();

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-2 py-1.5 glass rounded-full shadow-card flex items-center gap-0.5 max-w-[calc(100vw-1rem)]">
      {items.map((it) => {
        const Icon = it.icon;
        const isActive = active === it.id;
        return (
          <motion.button
            key={it.id}
            aria-label={it.label}
            title={it.label}
            onClick={() => onNavigate(it.id)}
            whileHover={{ scale: 1.15, rotate: -6 }}
            whileTap={{ scale: 0.85, rotate: 8 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            className="relative h-11 w-11 rounded-full flex items-center justify-center"
          >
            {isActive && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 rounded-full gradient-hero shadow-glow"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Icon className={`relative h-[18px] w-[18px] transition-colors ${isActive ? "text-primary-foreground" : "text-foreground/70"}`} />
          </motion.button>
        );
      })}
      <div className="w-px h-6 bg-border mx-1" />
      <motion.button
        onClick={toggle}
        aria-label="Toggle theme"
        title="Toggle theme"
        whileHover={{ scale: 1.15, rotate: 20 }}
        whileTap={{ scale: 0.85, rotate: -20 }}
        transition={{ type: "spring", stiffness: 500, damping: 18 }}
        className="h-11 w-11 rounded-full flex items-center justify-center text-foreground/70 hover:text-foreground"
      >
        {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
      </motion.button>
      {isAdmin && (
        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}>
          <Link
            to="/admin"
            aria-label="Admin"
            title="Admin Dashboard"
            className="h-11 w-11 rounded-full flex items-center justify-center text-foreground/70 hover:text-foreground"
          >
            <Shield className="h-[18px] w-[18px]" />
          </Link>
        </motion.div>
      )}
    </nav>
  );
};
