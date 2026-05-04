import { motion } from "framer-motion";

type Variant = "home" | "videos" | "about" | "skills" | "contact";

export const AnimatedBackground = ({ variant }: { variant: Variant }) => {
  if (variant === "home") {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 h-[40rem] w-[40rem] rounded-full bg-primary/25 blur-[140px]"
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 h-[35rem] w-[35rem] rounded-full bg-accent/25 blur-[140px]"
          animate={{ x: [0, -50, 0], y: [0, -40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    );
  }
  if (variant === "videos") {
    // film strip / scanlines
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "repeating-linear-gradient(0deg, hsl(var(--foreground)) 0 1px, transparent 1px 6px)" }} />
        <motion.div
          className="absolute left-0 right-0 h-24 bg-gradient-to-b from-primary/20 to-transparent"
          initial={{ top: "-10%" }}
          animate={{ top: "110%" }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -top-20 -right-20 h-[30rem] w-[30rem] rounded-full bg-accent/15 blur-[120px]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    );
  }
  if (variant === "about") {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <motion.div
          className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-primary/15 blur-[100px]"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    );
  }
  if (variant === "skills") {
    // floating pixels grid
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-sm bg-primary/30"
            style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 4 + (i % 5), repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
          />
        ))}
      </div>
    );
  }
  // contact: waves
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -bottom-40 left-1/2 -translate-x-1/2 h-[40rem] w-[40rem] rounded-full bg-primary/20 blur-[120px]"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};