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
import { AnalyticsTab } from "./tabs/AnalyticsTab";
import { AdminsTab } from "./tabs/AdminsTab";

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();

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
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
        </TabsList>
        <TabsContent value="profile"><ProfileTab /></TabsContent>
        <TabsContent value="photos"><PhotosTab /></TabsContent>
        <TabsContent value="videos"><VideosTab /></TabsContent>
        <TabsContent value="skills"><SkillsTab /></TabsContent>
        <TabsContent value="messages"><MessagesTab /></TabsContent>
        <TabsContent value="analytics"><AnalyticsTab /></TabsContent>
        <TabsContent value="admins"><AdminsTab /></TabsContent>
      </Tabs>
    </main>
  );
}
