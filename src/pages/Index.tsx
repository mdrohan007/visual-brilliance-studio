import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Profile, SocialLink, Skill, Video } from "@/types/site";
import { Hero } from "@/components/site/Hero";
import { Videos } from "@/components/site/Videos";
import { About } from "@/components/site/About";
import { Skills } from "@/components/site/Skills";
import { Contact } from "@/components/site/Contact";
import { BottomNav, type Section } from "@/components/site/BottomNav";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { useVisitorLog } from "@/hooks/useVisitorLog";

const Index = () => {
  useVisitorLog();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [active, setActive] = useState<Section>("home");

  useEffect(() => {
    (async () => {
      const [p, s, sk, v] = await Promise.all([
        supabase.from("profiles").select("*").limit(1).maybeSingle(),
        supabase.from("social_links").select("*").order("sort_order"),
        supabase.from("skills").select("*").order("sort_order"),
        supabase.from("videos").select("*").order("sort_order").order("created_at", { ascending: false }),
      ]);
      setProfile(p.data as Profile | null);
      setSocials((s.data as SocialLink[]) ?? []);
      setSkills((sk.data as Skill[]) ?? []);
      setVideos((v.data as Video[]) ?? []);
    })();
  }, []);

  // Update favicon dynamically
  useEffect(() => {
    if (!profile?.favicon_url) return;
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = profile.favicon_url;
  }, [profile?.favicon_url]);

  const goto = (id: Section) => {
    setActive(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages: Record<Section, JSX.Element> = {
    home: <Hero profile={profile} onExplore={() => goto("videos")} />,
    videos: <Videos videos={videos} />,
    about: <About profile={profile} socials={socials} />,
    skills: <Skills skills={skills} />,
    contact: <Contact />,
  };

  const bgMap: Record<Section, string | null | undefined> = {
    home: profile?.bg_home_url,
    videos: profile?.bg_videos_url,
    about: profile?.bg_about_url,
    skills: profile?.bg_skills_url,
    contact: profile?.bg_contact_url,
  };
  const customBg = bgMap[active];

  return (
    <main className="min-h-screen flex flex-col pb-28 relative">
      {customBg ? (
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${customBg})` }}
        >
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
        </div>
      ) : (
        <AnimatedBackground variant={active} />
      )}

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {pages[active]}
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav active={active} onNavigate={goto} />
      <WhatsAppFab number={profile?.whatsapp ?? "01829463474"} />
    </main>
  );
};

export default Index;
