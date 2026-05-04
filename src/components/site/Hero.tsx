import { Profile } from "@/types/site";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InstallPwaButton } from "./InstallPwaButton";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export const Hero = ({ profile, onExplore }: { profile: Profile | null; onExplore: () => void }) => {
  const { isAdmin } = useAuth();
  const banner = profile?.hero_banner_url;
  const initials = (profile?.display_name ?? "MR").split(" ").map((p) => p[0]).slice(0, 2).join("");

  return (
    <section className="relative min-h-[88vh] flex flex-col px-4 pt-6 pb-16">
      {/* Banner */}
      <div className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-card aspect-[16/7] sm:aspect-[16/6] bg-muted">
        {banner ? (
          <motion.img
            src={banner}
            alt="Hero banner"
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 gradient-hero" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent" />

        {/* Top-left profile card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-3 sm:gap-4 glass rounded-2xl p-3 sm:p-4 max-w-[85%]"
        >
          <Avatar className="h-14 w-14 sm:h-20 sm:w-20 ring-2 ring-background shadow-glow shrink-0">
            <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.display_name ?? "Profile"} />
            <AvatarFallback className="gradient-hero text-primary-foreground font-display">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-display leading-tight truncate">{profile?.display_name ?? "Md. Rohan"}</h1>
            <p className="text-[11px] sm:text-sm text-muted-foreground line-clamp-2">{profile?.title ?? "Video Editor & Graphics Designer"}</p>
          </div>
        </motion.div>
      </div>

      {/* Below banner */}
      <div className="max-w-3xl mx-auto text-center mt-10 sm:mt-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-3xl sm:text-5xl font-display mb-4 leading-tight"
        >
          <span className="gradient-text">Crafting visuals that move people.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-base sm:text-lg text-muted-foreground mb-8"
        >
          {profile?.bio ?? "Crafting cinematic stories and bold visuals."}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Button onClick={onExplore} size="lg" className="gradient-hero text-primary-foreground shadow-glow rounded-full px-8">
            Explore Work
          </Button>
          {isAdmin && <InstallPwaButton />}
        </motion.div>

        <button onClick={onExplore} className="mt-12 inline-flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors">
          <span className="text-xs uppercase tracking-widest mb-2">Explore</span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
};
