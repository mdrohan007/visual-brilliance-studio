import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile, SocialLink, Skill, Photo, Video } from "@/types/site";
import { Hero } from "@/components/site/Hero";
import { Portfolio } from "@/components/site/Portfolio";
import { About } from "@/components/site/About";
import { Skills } from "@/components/site/Skills";
import { Contact } from "@/components/site/Contact";
import { BottomNav } from "@/components/site/BottomNav";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { useVisitorLog } from "@/hooks/useVisitorLog";

type Section = "home" | "portfolio" | "about" | "skills" | "contact";

const Index = () => {
  useVisitorLog();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [active, setActive] = useState<Section>("home");
  const refs = useRef<Record<Section, HTMLDivElement | null>>({ home: null, portfolio: null, about: null, skills: null, contact: null });

  useEffect(() => {
    (async () => {
      const [p, s, sk, ph, v] = await Promise.all([
        supabase.from("profiles").select("*").limit(1).maybeSingle(),
        supabase.from("social_links").select("*").order("sort_order"),
        supabase.from("skills").select("*").order("sort_order"),
        supabase.from("photos").select("*").order("sort_order").order("created_at", { ascending: false }),
        supabase.from("videos").select("*").order("sort_order").order("created_at", { ascending: false }),
      ]);
      setProfile(p.data as Profile | null);
      setSocials((s.data as SocialLink[]) ?? []);
      setSkills((sk.data as Skill[]) ?? []);
      setPhotos((ph.data as Photo[]) ?? []);
      setVideos((v.data as Video[]) ?? []);
    })();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id as Section);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0.1, 0.3, 0.6] }
    );
    Object.values(refs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const goto = (id: Section) => refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="min-h-screen pb-28">
      <div ref={(el) => (refs.current.home = el)} id="home"><Hero profile={profile} onExplore={() => goto("portfolio")} /></div>
      <div ref={(el) => (refs.current.portfolio = el)} id="portfolio"><Portfolio photos={photos} videos={videos} /></div>
      <div ref={(el) => (refs.current.about = el)} id="about"><About profile={profile} socials={socials} /></div>
      <div ref={(el) => (refs.current.skills = el)} id="skills"><Skills skills={skills} /></div>
      <div ref={(el) => (refs.current.contact = el)} id="contact"><Contact /></div>

      <BottomNav active={active} onNavigate={goto} />
      <WhatsAppFab number={profile?.whatsapp ?? "01829463474"} />
    </main>
  );
};

export default Index;
