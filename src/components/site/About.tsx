import { Profile, SocialLink } from "@/types/site";
import { socialIcon, socialLabel } from "@/lib/icons";

export const About = ({ profile, socials }: { profile: Profile | null; socials: SocialLink[] }) => {
  const visible = socials.filter((s) => s.visible && s.url);
  return (
    <section id="about" className="px-4 py-20 max-w-4xl mx-auto">
      <div className="text-center mb-10 animate-fade-up">
        <h2 className="text-4xl sm:text-5xl font-display mb-3">About</h2>
        <p className="text-muted-foreground">Get to know me</p>
      </div>
      <div className="glass rounded-3xl p-8 sm:p-12 shadow-card text-center">
        <p className="text-lg sm:text-xl leading-relaxed mb-8">
          {profile?.bio || "I'm a freelance video editor and graphic designer crafting cinematic stories and bold visual identities."}
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-8 text-left max-w-md mx-auto">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Email</p>
            <a href={`mailto:${profile?.email}`} className="font-medium hover:text-primary break-all">{profile?.email}</a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">WhatsApp</p>
            <p className="font-medium">{profile?.whatsapp}</p>
          </div>
        </div>
        {visible.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 pt-6 border-t border-border/50">
            {visible.map((s) => {
              const Icon = socialIcon[s.platform];
              if (!Icon) return null;
              return (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={socialLabel[s.platform]}
                  title={socialLabel[s.platform]}
                  className="h-12 w-12 rounded-full glass flex items-center justify-center hover:scale-110 hover:shadow-glow transition-all"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
