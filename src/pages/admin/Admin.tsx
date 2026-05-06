import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Power } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ProfileTab } from "./tabs/ProfileTab";
import { PhotosTab } from "./tabs/PhotosTab";
import { VideosTab } from "./tabs/VideosTab";
import { SkillsTab } from "./tabs/SkillsTab";
import { MessagesTab } from "./tabs/MessagesTab";
import { AdminsTab } from "./tabs/AdminsTab";

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [unread, setUnread] = useState(0);
  const [maintenance, setMaintenance] = useState<boolean>(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    supabase.from("profiles").select("id, maintenance_mode").limit(1).maybeSingle().then(({ data }) => {
      if (data) {
        setProfileId((data as any).id);
        setMaintenance(!!(data as any).maintenance_mode);
      }
    });
  }, [isAdmin]);

  const toggleMaintenance = async (v: boolean) => {
    if (!profileId) return;
    setMaintenance(v);
    const { error } = await supabase.from("profiles").update({ maintenance_mode: v }).eq("id", profileId);
    if (error) {
      setMaintenance(!v);
      toast.error(error.message);
    } else {
      toast.success(v ? "Maintenance mode ON — site is OFF for visitors" : "Site is back ON");
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      const { count } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);
      setUnread(count ?? 0);
    };
    load();
    const ch = supabase
      .channel("unread-messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_messages" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [isAdmin]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <main className="min-h-screen flex items-center justify-center px-4 text-center"><div><p className="text-muted-foreground mb-4">You don't have admin access.</p><Button onClick={() => supabase.auth.signOut()}>Sign out</Button></div></main>;

  return (
    <main className="min-h-screen px-4 py-8 pb-28 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display gradient-text">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="icon" className="sm:hidden" aria-label="Site" onClick={() => nav("/")}><Home className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" className="sm:hidden" aria-label="Sign out" onClick={async () => { await supabase.auth.signOut(); nav("/"); }}><LogOut className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={() => nav("/")}><Home className="h-4 w-4 mr-2" />Site</Button>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={async () => { await supabase.auth.signOut(); nav("/"); }}><LogOut className="h-4 w-4 mr-2" />Sign out</Button>
        </div>
      </header>

      <Tabs defaultValue="profile">
        <TabsList className="flex flex-wrap h-auto gap-1 mb-6 bg-muted/50 p-1 rounded-2xl">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="messages" className="relative">
            Messages
            {unread > 0 && (
              <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold">
                {unread}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
        </TabsList>
        <TabsContent value="profile"><ProfileTab /></TabsContent>
        <TabsContent value="photos"><PhotosTab /></TabsContent>
        <TabsContent value="videos"><VideosTab /></TabsContent>
        <TabsContent value="skills"><SkillsTab /></TabsContent>
        <TabsContent value="messages"><MessagesTab /></TabsContent>
        <TabsContent value="admins"><AdminsTab /></TabsContent>
      </Tabs>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 glass rounded-full shadow-card px-4 py-2.5 flex items-center gap-3">
        <Power className={`h-4 w-4 ${maintenance ? "text-destructive" : "text-green-500"}`} />
        <span className="text-sm font-medium whitespace-nowrap">
          {maintenance ? "Site: OFF (Maintenance)" : "Site: ON"}
        </span>
        <Switch checked={maintenance} onCheckedChange={toggleMaintenance} />
      </div>
    </main>
  );
}
