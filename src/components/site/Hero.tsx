import { Profile } from "@/types/site";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InstallPwaButton } from "./InstallPwaButton";
import { ArrowDown, Mail, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export const Hero = ({ profile, onExplore }: { profile: Profile | null; onExplore: () => void }) => {
  const { isAdmin } = useAuth();
  const banner = profile?.hero_banner_url;
  const initials = (profile?.display_name ?? "MR").split(" ").map((p) => p[0]).slice(0, 2).join("");

  return (
    <section className="relative px-3 sm:px-4 pt-6 pb-20 max-w-3xl mx-auto">
      {/* LinkedIn-style card */}
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="rounded-3xl overflow-hidden bg-transparent"
      >
        {/* Cover banner */}
        <div className="relative w-full aspect-[16/6] bg-muted">
          {banner ? (
            <img src={banner} alt="Cover" draggable={false} onContextMenu={(e) => !isAdmin && e.preventDefault()} className="absolute inset-0 w-full h-full object-cover select-none" />
          ) : (
            <div className="absolute inset-0 gradient-hero" />
          )}
        </div>

        {/* Profile photo overlapping cover */}
        <div className="px-5 sm:px-8 pb-6 -mt-14 sm:-mt-16">
          <Avatar className="h-28 w-28 sm:h-32 sm:w-32 ring-4 ring-background shadow-glow">
            <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.display_name ?? "Profile"} />
            <AvatarFallback className="gradient-hero text-primary-foreground font-display text-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="mt-4">
            <h1 className="text-2xl sm:text-3xl font-display leading-tight">
              {profile?.display_name ?? "Md. Rohan"}
            </h1>
            <p className="text-base text-foreground/80 mt-1">
              {profile?.title ?? "Video Editor & Graphics Designer"}
            </p>
            {profile?.bio && (
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{profile.bio}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 mt-5 text-sm text-muted-foreground">
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
                  <Mail className="h-4 w-4" /> {profile.email}
                </a>
              )}
              {profile?.whatsapp && (
                <span className="inline-flex items-center gap-1.5">
                  <MessageCircle className="h-4 w-4" /> {profile.whatsapp}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <Button onClick={onExplore} size="lg" className="gradient-hero text-primary-foreground shadow-glow rounded-full px-7">
                Explore Work
              </Button>
              {isAdmin && <InstallPwaButton />}
            </div>
          </div>
        </div>
      </motion.article>

      <button onClick={onExplore} className="mt-10 mx-auto flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors">
        <span className="text-xs uppercase tracking-widest mb-2">Explore</span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </button>
    </section>
  );
};
