import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useVisitorLog = () => {
  useEffect(() => {
    if (sessionStorage.getItem("visit_logged")) return;
    sessionStorage.setItem("visit_logged", "1");
    supabase.from("visitor_logs").insert({
      path: window.location.pathname,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
    });
  }, []);
};
