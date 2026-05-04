import { MessageCircle } from "lucide-react";

export const WhatsAppFab = ({ number }: { number: string }) => {
  const clean = number.replace(/[^0-9]/g, "");
  const intl = clean.startsWith("0") ? "88" + clean : clean;
  return (
    <a
      href={`https://wa.me/${intl}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-40 h-14 w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-glow hover:scale-110 transition-transform animate-float"
    >
      <MessageCircle className="h-7 w-7 fill-white" />
    </a>
  );
};
