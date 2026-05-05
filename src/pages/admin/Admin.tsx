import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";
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
    <main className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display gradient-text">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => nav("/")}><Home className="h-4 w-4 mr-2" />Site</Button>
          <Button variant="outline" size="sm" onClick={async () => { await supabase.auth.signOut(); nav("/"); }}><LogOut className="h-4 w-4 mr-2" />Sign out</Button>
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
    </main>
  );
}
