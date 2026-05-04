import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const InstallPwaButton = () => {
  const [prompt, setPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (installed || !prompt) return null;
  return (
    <Button
      onClick={async () => {
        prompt.prompt();
        const { outcome } = await prompt.userChoice;
        if (outcome === "accepted") setPrompt(null);
      }}
      className="gradient-hero text-primary-foreground shadow-glow"
    >
      <Download className="h-4 w-4 mr-2" /> Install App
    </Button>
  );
};
