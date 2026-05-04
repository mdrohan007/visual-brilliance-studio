import { Link } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";
import { Profile } from "@/types/site";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Footer = ({ profile }: { profile: Profile | null }) => {
  const { user } = useAuth();
  const text = profile?.footer_text || `© ${new Date().getFullYear()} Formal Science. All rights reserved.`;
  return (
    <footer className="relative z-10 mt-16 border-t border-border/50 px-4 py-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p className="text-center sm:text-left">{text}</p>
        {user ? (
          <button
            onClick={() => supabase.auth.signOut()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted transition-colors text-xs"
          >
            <LogOut className="h-3.5 w-3.5" /> Log out
          </button>
        ) : (
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted transition-colors text-xs"
          >
            <LogIn className="h-3.5 w-3.5" /> Admin login
          </Link>
        )}
      </div>
    </footer>
  );
};
