import { Profile } from "@/types/site";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InstallPwaButton } from "./InstallPwaButton";
import { ArrowDown } from "lucide-react";

export const Hero = ({ profile, onExplore }: { profile: Profile | null; onExplore: () => void }) => {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center px-4 pt-20 pb-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-primary/30 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-accent/30 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center animate-fade-up">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute -inset-2 gradient-hero rounded-full blur-md opacity-70" />
            <Avatar className="relative h-32 w-32 sm:h-40 sm:w-40 ring-4 ring-background shadow-glow">
              <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.display_name ?? "Profile"} />
              <AvatarFallback className="text-3xl gradient-hero text-primary-foreground">MR</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-display mb-4 leading-[0.95]">
          <span className="gradient-text">{profile?.display_name ?? "Md. Rohan"}</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-2 font-medium">{profile?.title ?? "Video Editor & Graphics Designer"}</p>
        <p className="text-base text-muted-foreground/80 max-w-2xl mx-auto mb-10">
          {profile?.bio ?? "Crafting cinematic stories and bold visuals."}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={onExplore} size="lg" className="gradient-hero text-primary-foreground shadow-glow rounded-full px-8">
            Explore Portfolio
          </Button>
          <InstallPwaButton />
        </div>

        <button onClick={onExplore} className="mt-16 inline-flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors">
          <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
};
