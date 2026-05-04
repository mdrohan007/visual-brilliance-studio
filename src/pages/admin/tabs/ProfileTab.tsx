import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile, SocialLink } from "@/types/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { socialLabel } from "@/lib/icons";

export const ProfileTab = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [pwd, setPwd] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("profiles").select("*").limit(1).maybeSingle().then(({ data }) => setProfile(data as any));
    supabase.from("social_links").select("*").order("sort_order").then(({ data }) => setSocials((data as any) ?? []));
  }, []);

  const saveProfile = async () => {
    if (!profile) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").update({
      display_name: profile.display_name,
      title: profile.title,
      bio: profile.bio,
      email: profile.email,
      whatsapp: profile.whatsapp,
      avatar_url: profile.avatar_url,
      hero_banner_url: profile.hero_banner_url ?? null,
      logo_url: profile.logo_url ?? null,
      footer_text: profile.footer_text ?? null,
    }).eq("id", profile.id);
    setBusy(false);
    error ? toast.error(error.message) : toast.success("Profile updated");
  };

  const uploadAvatar = async (file: File) => {
    if (!profile) return;
    const ext = file.name.split(".").pop();
    const path = `avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { toast.error(error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    setProfile({ ...profile, avatar_url: publicUrl });
    toast.success("Avatar uploaded — click Save");
  };

  const uploadAsset = async (file: File, key: "hero_banner_url" | "logo_url") => {
    if (!profile) return;
    const ext = file.name.split(".").pop();
    const path = `${key}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { toast.error(error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    setProfile({ ...profile, [key]: publicUrl });
    toast.success("Uploaded — click Save");
  };

  const updateSocial = (id: string, patch: Partial<SocialLink>) =>
    setSocials((arr) => arr.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const saveSocial = async (s: SocialLink) => {
    const { error } = await supabase.from("social_links").update({ url: s.url, visible: s.visible }).eq("id", s.id);
    error ? toast.error(error.message) : toast.success(`${socialLabel[s.platform]} saved`);
  };

  const changePassword = async () => {
    if (pwd.length < 6) return toast.error("At least 6 characters");
    const { error } = await supabase.auth.updateUser({ password: pwd });
    error ? toast.error(error.message) : (toast.success("Password updated"), setPwd(""));
  };

  if (!profile) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-8">
      <section className="glass rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-display">Profile info</h2>
        <div className="flex items-center gap-4">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="h-20 w-20 rounded-full object-cover ring-2 ring-border" />
          ) : (
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground">N/A</div>
          )}
          <Label className="cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])} />
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted text-sm"><Upload className="h-4 w-4" /> Upload photo</span>
          </Label>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Name</Label><Input value={profile.display_name} onChange={(e) => setProfile({ ...profile, display_name: e.target.value })} /></div>
          <div><Label>Title</Label><Input value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} /></div>
          <div><Label>Email</Label><Input value={profile.email ?? ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></div>
          <div><Label>WhatsApp</Label><Input value={profile.whatsapp ?? ""} onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })} /></div>
        </div>
        <div><Label>Bio</Label><Textarea rows={3} value={profile.bio ?? ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} /></div>
        <Button onClick={saveProfile} disabled={busy} className="gradient-hero text-primary-foreground">Save profile</Button>
      </section>

      <section className="glass rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-display">Social links</h2>
        {socials.map((s) => (
          <div key={s.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <span className="w-32 text-sm font-medium">{socialLabel[s.platform] ?? s.platform}</span>
            <Input className="flex-1" placeholder="https://..." value={s.url} onChange={(e) => updateSocial(s.id, { url: e.target.value })} />
            <div className="flex items-center gap-2">
              <Switch checked={s.visible} onCheckedChange={(v) => updateSocial(s.id, { visible: v })} />
              <Button size="sm" variant="outline" onClick={() => saveSocial(s)}>Save</Button>
            </div>
          </div>
        ))}
      </section>

      <section className="glass rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-display">Change password</h2>
        <div className="flex gap-2 max-w-md">
          <Input type="password" placeholder="New password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
          <Button onClick={changePassword}>Update</Button>
        </div>
      </section>
    </div>
  );
};
