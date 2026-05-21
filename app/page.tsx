"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import {
  BookOpen,
  Camera,
  ChevronDown,
  Crown,
  GraduationCap,
  Heart,
  Sparkles,
  Star,
  Trophy,
  X,
  Quote,
  Flower2,
} from "lucide-react";
import confetti from "canvas-confetti";

// ─── Types ────────────────────────────────────────────────────────────────────

type PhotoAspect = "portrait" | "landscape" | "square";

type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
  aspect: PhotoAspect;
  featured?: boolean;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const galleryPhotos: GalleryPhoto[] = [
  {
    id: "portrait",
    src: "/photos/kyla-01.jpg",
    alt: "Kyla Kim C. Sto. Domingo portrait",
    title: "The Portrait",
    caption: "A frame for the graduate, the grace, and the glow.",
    aspect: "portrait",
    featured: true,
  },
  {
    id: "the-photographer",
    src: "/photos/kyla-02.jpg",
    alt: "Kyla Kim C. Sto. Domingo with her camera",
    title: "Behind the Lens",
    caption: "She captures the world beautifully — just like she does everything else.",
    aspect: "portrait",
  },
  {
    id: "restaurant-glow",
    src: "/photos/kyla-03.jpg",
    alt: "Kyla Kim C. Sto. Domingo enjoying a meal",
    title: "The Celebrant",
    caption: "That smile across the table. Worth every late night and every revision.",
    aspect: "landscape",
    featured: true,
  },
  {
    id: "soft-light",
    src: "/photos/kyla-04.jpg",
    alt: "Kyla Kim C. Sto. Domingo in a quiet moment",
    title: "Still & Soft",
    caption: "Even in stillness, impossible to look away from.",
    aspect: "portrait",
  },
  {
    id: "morning-glow",
    src: "/photos/kyla-05.jpg",
    alt: "Kyla Kim C. Sto. Domingo soft selfie",
    title: "Morning Glow",
    caption: "No filter needed. She just looks like that.",
    aspect: "portrait",
  },
  {
    id: "radiant",
    src: "/photos/kyla-06.jpg",
    alt: "Kyla Kim C. Sto. Domingo bright smile",
    title: "Radiant",
    caption: "The kind of smile that makes a whole room warmer.",
    aspect: "portrait",
  },
  {
    id: "sleepy-smile",
    src: "/photos/kyla-07.jpg",
    alt: "Kyla Kim C. Sto. Domingo cute squinting smile",
    title: "That Smile Though",
    caption: "Half-asleep and still the cutest person in the room.",
    aspect: "portrait",
  },
  {
    id: "campus-pout",
    src: "/photos/kyla-08.jpg",
    alt: "Kyla Kim C. Sto. Domingo with ID lanyard",
    title: "Campus Days",
    caption: "Every school day had her in it. That made it better.",
    aspect: "portrait",
  },
  {
    id: "glasses-girl",
    src: "/photos/kyla-09.jpg",
    alt: "Kyla Kim C. Sto. Domingo in glasses collage",
    title: "Four of Her",
    caption: "Four frames, one Kyla — still not enough.",
    aspect: "square",
    featured: true,
  },
];

const milestones = [
  {
    icon: BookOpen,
    label: "Year One",
    title: "The Sociological Imagination",
    copy: "Learning to see personal stories and public issues with sharper, kinder eyes.",
    year: "2022",
    color: "from-pink-500 to-rose-400",
    glow: "rgba(244,114,182,0.3)",
  },
  {
    icon: Star,
    label: "The Grind",
    title: "Fieldwork, Theories, Revisions",
    copy: "Long readings, difficult arguments, and the discipline to keep showing up anyway.",
    year: "2023–24",
    color: "from-purple-500 to-violet-400",
    glow: "rgba(192,132,252,0.3)",
  },
  {
    icon: Trophy,
    label: "The Pinnacle",
    title: "The Thesis Defense",
    copy: "A final proof that the work was never just hard. It was worth it.",
    year: "2025",
    color: "from-amber-400 to-pink-400",
    glow: "rgba(251,191,36,0.25)",
  },
];

const loveNotes = [
  "Kyla Kim — every time I see your name I feel something warm.",
  "The way you carry yourself is impossible to forget.",
  "Four years, and you came out more yourself than ever.",
  "You make hard things look graceful.",
  "I'm proud of you in ways I probably won't say out loud.",
];

// ─── Live Hearts Canvas (Violet + Pink) ─────────────────────────────────────

type FloatingHeart = {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  drift: number;
  driftSpeed: number;
  phase: number;
  color: string;
};

function LiveHeartsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heartsRef = useRef<FloatingHeart[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = [
      "rgba(244,114,182,",  // pink-400
      "rgba(236,72,153,",   // pink-500
      "rgba(192,132,252,",  // purple-400
      "rgba(167,139,250,",  // violet-400
      "rgba(139,92,246,",   // violet-500
      "rgba(232,121,249,",  // fuchsia-400
      "rgba(249,168,212,",  // pink-300
      "rgba(216,180,254,",  // purple-300
    ];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Seed initial hearts
    function createHeart(): FloatingHeart {
      return {
        x: Math.random() * (canvas?.width ?? 1920),
        y: (canvas?.height ?? 1080) + Math.random() * 200,
        size: Math.random() * 16 + 8,
        speed: Math.random() * 0.8 + 0.3,
        opacity: Math.random() * 0.4 + 0.15,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        drift: Math.random() * 60 + 20,
        driftSpeed: Math.random() * 0.005 + 0.003,
        phase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    }

    heartsRef.current = Array.from({ length: 35 }, createHeart);
    // Spread initial hearts across the viewport
    heartsRef.current.forEach((h) => {
      h.y = Math.random() * (canvas.height + 200) - 100;
    });

    function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, color: string, opacity: number) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(size / 30, size / 30);
      ctx.globalAlpha = opacity;

      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.bezierCurveTo(-15, -25, -30, -5, 0, 18);
      ctx.moveTo(0, -8);
      ctx.bezierCurveTo(15, -25, 30, -5, 0, 18);

      ctx.fillStyle = color + opacity + ")";
      ctx.fill();

      // Glow
      ctx.shadowColor = color + "0.4)";
      ctx.shadowBlur = size * 1.5;
      ctx.fill();

      ctx.restore();
    }

    let time = 0;
    function animate() {
      time += 1;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const heart of heartsRef.current) {
        heart.y -= heart.speed;
        heart.rotation += heart.rotationSpeed;
        const sway = Math.sin(time * heart.driftSpeed + heart.phase) * heart.drift;

        drawHeart(ctx!, heart.x + sway, heart.y, heart.size, heart.rotation, heart.color, heart.opacity);

        // Reset when off screen
        if (heart.y < -50) {
          heart.x = Math.random() * canvas!.width;
          heart.y = canvas!.height + Math.random() * 100;
          heart.size = Math.random() * 16 + 8;
          heart.speed = Math.random() * 0.8 + 0.3;
          heart.opacity = Math.random() * 0.4 + 0.15;
          heart.phase = Math.random() * Math.PI * 2;
        }
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-hearts-canvas blend-screen"
      aria-hidden="true"
    />
  );
}

// ─── Floating Particles ────────────────────────────────────────────────────────

function FloatingParticles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  const particles = [
    { emoji: "🌸", left: "8%", delay: "0s", duration: "12s", drift: "30px" },
    { emoji: "✨", left: "18%", delay: "2s", duration: "10s", drift: "-20px" },
    { emoji: "💗", left: "30%", delay: "4s", duration: "14s", drift: "25px" },
    { emoji: "🌸", left: "45%", delay: "1s", duration: "11s", drift: "-35px" },
    { emoji: "⭐", left: "58%", delay: "3s", duration: "13s", drift: "20px" },
    { emoji: "💜", left: "68%", delay: "5s", duration: "12s", drift: "-25px" },
    { emoji: "✨", left: "78%", delay: "1.5s", duration: "10s", drift: "40px" },
    { emoji: "🌸", left: "88%", delay: "6s", duration: "15s", drift: "-15px" },
  ];

  if (!mounted) return null;

  return (
    <div className="particles-container" aria-hidden="true">
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: p.left,
            "--delay": p.delay,
            "--duration": p.duration,
            "--drift": p.drift,
            fontSize: "1.2rem",
          } as React.CSSProperties}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
}

// ─── Ambient Orbs ─────────────────────────────────────────────────────────────

function AmbientOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden blend-screen" aria-hidden="true">
      <div
        className="orb-1 absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, rgba(244,114,182,0.4) 0%, transparent 70%)" }}
      />
      <div
        className="orb-2 absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, rgba(192,132,252,0.4) 0%, transparent 70%)" }}
      />
      <div
        className="orb-3 absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full opacity-25"
        style={{ background: "radial-gradient(circle, rgba(251,113,133,0.35) 0%, transparent 70%)" }}
      />
    </div>
  );
}

// ─── Twinkling Stars Background ───────────────────────────────────────────────

function StarField() {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStars(
        Array.from({ length: 50 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 0.5,
          delay: Math.random() * 5,
          duration: Math.random() * 3 + 2,
        }))
      );
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star-twinkle absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            "--delay": `${star.delay}s`,
            "--duration": `${star.duration}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── Cursor Sparkle ───────────────────────────────────────────────────────────

function CursorSparkle() {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const counterRef = useRef(0);

  useEffect(() => {
    const colors = ["#f472b6", "#c084fc", "#818cf8", "#f9a8d4", "#e879f9", "#fbbf24"];
    let lastTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < 80) return;
      lastTime = now;

      const id = counterRef.current++;
      const color = colors[Math.floor(Math.random() * colors.length)];
      setSparkles((prev) => [...prev.slice(-12), { id, x: e.clientX, y: e.clientY, color }]);
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== id));
      }, 600);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="cursor-sparkle"
          style={{
            left: s.x - 4,
            top: s.y - 4,
            width: 8,
            height: 8,
            backgroundColor: s.color,
            boxShadow: `0 0 6px ${s.color}, 0 0 12px ${s.color}`,
          }}
        />
      ))}
    </>
  );
}

// ─── Smart Image ──────────────────────────────────────────────────────────────

function SmartImage({
  src,
  alt,
  priority = false,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={className}
      onError={() => setVisible(false)}
    />
  );
}

// ─── Photo Fallback ───────────────────────────────────────────────────────────

function PhotoFallback({ label = "Kyla Kim" }: { label?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden text-white"
      style={{
        background: "radial-gradient(circle at top, rgba(244,114,182,0.3), transparent 40%), radial-gradient(circle at 70% 20%, rgba(192,132,252,0.25), transparent 36%), linear-gradient(180deg, #12091d 0%, #050712 100%)"
      }}
    >
      <div className="absolute inset-5 rounded-[2rem] border border-pink-400/20" />
      <motion.span
        className="relative text-8xl font-black leading-none text-pink-400/80 md:text-9xl"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        K
      </motion.span>
      <span className="relative mt-4 max-w-[80%] text-center text-xs font-bold uppercase tracking-[0.25em] text-white/60">
        {label}
      </span>
    </div>
  );
}

// ─── Typewriter ───────────────────────────────────────────────────────────────

function Typewriter({ texts }: { texts: string[] }) {
  const [displayed, setDisplayed] = useState("");
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    const speed = deleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) {
          setDisplayed(current.slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
        } else {
          setTimeout(() => setDeleting(true), 2500);
        }
      } else {
        if (charIdx > 0) {
          setDisplayed(current.slice(0, charIdx - 1));
          setCharIdx((c) => c - 1);
        } else {
          setDeleting(false);
          setTextIdx((i) => (i + 1) % texts.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [charIdx, deleting, textIdx, texts]);

  return (
    <span className="text-pink-300">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block ml-0.5 h-[1em] w-0.5 bg-pink-400 align-middle"
      />
    </span>
  );
}

// ─── Runaway "Maybe Later" Messages ───────────────────────────────────────────

const maybeLaterReplies = [
  "Nope! 😜",
  "Hehe nice try 💗",
  "Can't escape this date 🌸",
  "You already said yes in my head 😏",
  "Not an option, Kyla 💜",
  "Wrong button, try again ✨",
  "Di pwede! 😤💕",
  "Sige na pleasee 🥺",
  "Just say yes na!! 💗",
];

// ─── Celebration Modal ────────────────────────────────────────────────────────

function CelebrationModal({ onClose }: { onClose: () => void }) {
  const [accepted, setAccepted] = useState(false);
  const [maybeLaterPos, setMaybeLaterPos] = useState({ x: 0, y: 0 });
  const [runawayCount, setRunawayCount] = useState(0);
  const [maybeLaterText, setMaybeLaterText] = useState("Maybe later");
  const modalRef = useRef<HTMLDivElement>(null);

  const runAway = useCallback(() => {
    // Move the button to a random position within the modal
    const maxX = 180;
    const maxY = 100;
    const newX = (Math.random() - 0.5) * maxX * 2;
    const newY = (Math.random() - 0.5) * maxY * 2;
    setMaybeLaterPos({ x: newX, y: newY });
    setRunawayCount((c) => c + 1);
    setMaybeLaterText(maybeLaterReplies[Math.floor(Math.random() * maybeLaterReplies.length)]);
  }, []);

  function celebrate() {
    setAccepted(true);
    const duration = 4000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: ["#f472b6", "#c084fc", "#818cf8", "#f9a8d4", "#fb7185", "#fbbf24"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: ["#f472b6", "#c084fc", "#818cf8", "#f9a8d4", "#fb7185", "#fbbf24"],
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(24px)", background: "rgba(2,4,10,0.88)" }}
    /* No onClick={onClose} — can't dismiss by clicking outside */
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 40 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative w-full max-w-lg text-center text-white"
        style={{
          background: "radial-gradient(circle at top, rgba(244,114,182,0.12), transparent 60%), rgba(11,7,17,0.97)",
          borderRadius: "2rem",
          border: "1px solid rgba(244,114,182,0.25)",
          boxShadow: "0 0 80px rgba(244,114,182,0.15), 0 25px 50px rgba(0,0,0,0.5)",
          padding: "3rem 2.5rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow border */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-50"
          style={{ boxShadow: "inset 0 0 40px rgba(244,114,182,0.1)" }}
        />

        {/* No close button — she must say yes! */}

        <AnimatePresence mode="wait">
          {!accepted ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <motion.div
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ background: "rgba(244,114,182,0.15)", boxShadow: "0 0 30px rgba(244,114,182,0.25)" }}
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Heart className="h-8 w-8 text-pink-400 heartbeat" />
              </motion.div>

              <p className="text-xs font-bold uppercase tracking-[0.35em] text-pink-400">
                Final Honor
              </p>
              <h2 className="font-serif mt-4 text-5xl font-semibold italic tracking-tight" style={{ color: "#fff" }}>
                Tara Date?
              </h2>
              <p className="mx-auto mt-5 max-w-sm text-sm leading-8 text-slate-300">
                After the thesis, the defense, and every brave version of you that got here —
                you deserve a night that feels as beautiful as this win. 🌸
              </p>

              <div className="mt-8 flex flex-col items-center gap-4 overflow-visible" style={{ minHeight: "120px" }}>
                <motion.button
                  type="button"
                  className="btn-premium inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white"
                  onClick={celebrate}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className="h-4 w-4" />
                  Yes, let&apos;s celebrate!
                </motion.button>

                {/* Runaway "Maybe later" button */}
                <motion.button
                  type="button"
                  className="relative rounded-full px-4 py-2 text-xs transition-all"
                  style={{
                    color: runawayCount > 0 ? "#f472b6" : "#64748b",
                    background: runawayCount > 0 ? "rgba(244,114,182,0.08)" : "transparent",
                    border: runawayCount > 0 ? "1px solid rgba(244,114,182,0.2)" : "1px solid transparent",
                  }}
                  animate={{
                    x: maybeLaterPos.x,
                    y: maybeLaterPos.y,
                    scale: runawayCount > 2 ? 0.8 : 1,
                  }}
                  transition={{ type: "spring", damping: 12, stiffness: 200 }}
                  onMouseEnter={runAway}
                  onClick={runAway}
                  onTouchStart={runAway}
                >
                  {maybeLaterText}
                </motion.button>
              </div>

              {runawayCount >= 3 && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-xs text-pink-400/70 italic"
                >
                  The button keeps running... just say yes na! 💗
                </motion.p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="accepted"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <motion.div
                className="mx-auto mb-6 text-6xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.8 }}
              >
                🎉
              </motion.div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-pink-400">Reserved</p>
              <h2 className="font-serif mt-4 text-5xl font-semibold italic">
                It&apos;s a Date. 💗
              </h2>
              <p className="mx-auto mt-5 max-w-sm text-sm leading-8 text-slate-300">
                Proud na proud ako, Kyla. You made this moment look elegant,
                even after everything it took to earn it.
              </p>
              <button
                type="button"
                className="mt-8 rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                onClick={onClose}
              >
                Close ✨
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ─── Photo Lightbox ───────────────────────────────────────────────────────────

function PhotoLightbox({ photo, onClose }: { photo: GalleryPhoto; onClose: () => void }) {
  useEffect(() => {
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(28px)", background: "rgba(2,4,10,0.9)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 30 }}
        transition={{ type: "spring", damping: 22, stiffness: 280 }}
        className="relative w-full max-w-4xl"
        style={{
          borderRadius: "2rem",
          border: "1px solid rgba(192,132,252,0.25)",
          background: "rgba(9,7,20,0.97)",
          boxShadow: "0 0 100px rgba(192,132,252,0.15), 0 25px 60px rgba(0,0,0,0.6)",
          padding: "1.5rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/70 backdrop-blur transition hover:text-white hover:bg-white/10"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div
          className={`relative mx-auto overflow-hidden bg-[#10091c] ${photo.aspect === "portrait"
            ? "aspect-[4/5] max-h-[75vh] max-w-md"
            : photo.aspect === "square"
              ? "aspect-square max-h-[75vh] max-w-2xl"
              : "aspect-[16/10] max-h-[75vh]"
            }`}
          style={{ borderRadius: "1.5rem" }}
        >
          <PhotoFallback label={photo.title} />
          <SmartImage
            src={photo.src}
            alt={photo.alt}
            sizes="(max-width: 1024px) 92vw, 960px"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)" }}
          />
        </div>

        <div className="px-2 pb-2 pt-5 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-purple-400">
            Kyla Kim Archive
          </p>
          <h3 className="font-serif mt-2 text-3xl font-semibold italic">{photo.title}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-300">{photo.caption}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Animated Section Wrapper ──────────────────────────────────────────────────

function RevealSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Milestone Card ───────────────────────────────────────────────────────────

function MilestoneCard({
  item,
  index,
}: {
  item: (typeof milestones)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = item.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl p-7 transition-all duration-500"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 0 0 rgba(0,0,0,0)",
      }}
      whileHover={{
        y: -4,
        boxShadow: `0 20px 60px ${item.glow}, 0 0 30px ${item.glow}`,
        borderColor: "rgba(244,114,182,0.25)",
      }}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${item.color} opacity-60 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div
        className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} p-0.5`}
      >
        <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0a0712]">
          <Icon className="h-5 w-5 text-pink-300" />
        </div>
      </div>

      <p className="text-xs font-bold uppercase tracking-[0.3em] text-pink-400">{item.label}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">{item.year}</p>
      <h3 className="font-serif mt-4 text-2xl font-semibold italic text-white">{item.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-400">{item.copy}</p>
    </motion.div>
  );
}

// ─── Love Letter Section ──────────────────────────────────────────────────────

function LoveLetterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="relative overflow-hidden px-6 py-28 sm:px-8 lg:px-12"
      style={{
        background: "linear-gradient(180deg, #04050d 0%, #080516 50%, #04050d 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(192,132,252,0.12) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            background: "rgba(244,114,182,0.12)",
            border: "1px solid rgba(244,114,182,0.25)",
            boxShadow: "0 0 30px rgba(244,114,182,0.2)",
          }}
        >
          <Quote className="h-6 w-6 text-pink-400" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs font-bold uppercase tracking-[0.4em] text-purple-400"
        >
          A Note
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif mt-5 text-5xl font-light italic text-white sm:text-6xl lg:text-7xl"
          style={{ lineHeight: 1.15 }}
        >
          Dear Kyla Kim,
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="love-letter mx-auto mt-8 max-w-2xl"
        >
          <p>
            There&apos;s something about the way you carry yourself — like every hard season was just
            practice for arriving here, like this, with that exact kind of grace.
          </p>
          <p className="mt-6">
            Four years of sociology, of learning to read the world more carefully, and you came out
            the other side with a sharper mind and the same warm heart.
          </p>
          <p className="mt-6">
            I won&apos;t say everything I want to say. But I will say: I am proud of you in the quietest,
            most honest way — the kind that doesn&apos;t need an audience.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex items-center justify-center gap-3"
        >
          <div className="h-px flex-1 max-w-24" style={{ background: "linear-gradient(to right, transparent, rgba(244,114,182,0.4))" }} />
          <Heart className="h-4 w-4 text-pink-400 heartbeat" />
          <div className="h-px flex-1 max-w-24" style={{ background: "linear-gradient(to left, transparent, rgba(244,114,182,0.4))" }} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="font-serif mt-6 text-2xl italic text-pink-300"
        >
          — Always rooting for you 🌸
        </motion.p>
      </div>
    </section>
  );
}

// ─── Decorative Sparkles (deterministic positions) ────────────────────────────

const decorativeSparklePositions = [
  { top: "18%", left: "8%" },
  { top: "42%", left: "22%" },
  { top: "65%", left: "12%" },
  { top: "30%", left: "85%" },
  { top: "55%", left: "78%" },
  { top: "75%", left: "92%" },
];

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function KylaGraduationPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const overlayOpen = selectedPhoto !== null || celebrationOpen;

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const { scrollYProgress: pageScrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    document.body.style.overflow = overlayOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [overlayOpen]);

  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <CursorSparkle />
      <FloatingParticles />
      <AmbientOrbs />
      <StarField />

      <main className="relative min-h-screen bg-[#02040a] text-white" style={{ fontFamily: '"Inter", sans-serif' }}>
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
          style={{
            scaleX: pageScrollYProgress,
            background: "linear-gradient(90deg, #f472b6, #c084fc, #818cf8)",
            boxShadow: "0 0 10px rgba(244,114,182,0.5)"
          }}
        />

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section ref={heroRef} className="relative isolate flex min-h-screen flex-col overflow-hidden">

          {/* Parallax background photo */}
          <motion.div className="absolute inset-0 -z-10" style={{ y: heroY }}>
            <PhotoFallback />
            <SmartImage
              src="/photos/kyla-hero.jpg"
              alt="Portrait of Kyla Kim C. Sto. Domingo"
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>

          {/* Multi-layer overlays */}
          <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(2,4,10,0.6) 60%, rgba(2,4,10,0.95) 100%)" }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(circle at 30% 50%, rgba(244,114,182,0.08), transparent 60%)" }}
            aria-hidden="true"
          />

          {/* Live floating hearts — violet + pink */}
          <LiveHeartsCanvas />

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 flex w-full items-center justify-between gap-4 px-6 py-5 md:px-10"
          >
            <div className="flex min-w-0 items-center gap-3">
              <motion.span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-sm text-pink-400"
                style={{
                  background: "rgba(244,114,182,0.1)",
                  border: "1px solid rgba(244,114,182,0.35)",
                  boxShadow: "0 0 20px rgba(244,114,182,0.2)",
                }}
                whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(244,114,182,0.4)" }}
              >
                K
              </motion.span>
              <span className="truncate text-xs font-semibold uppercase tracking-[0.35em] text-pink-300/90 sm:text-sm">
                KYLA KIM C. STO. DOMINGO
              </span>
            </div>

            <div
              className="shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.4em] text-pink-300"
              style={{
                background: "rgba(244,114,182,0.08)",
                border: "1px solid rgba(244,114,182,0.2)",
              }}
            >
              CLASS OF 2026
            </div>
          </motion.header>

          {/* Hero content */}
          <motion.section
            style={{ opacity: heroOpacity }}
            className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest text-pink-300 sm:text-sm"
              style={{
                background: "rgba(244,114,182,0.1)",
                border: "1px solid rgba(244,114,182,0.2)",
                backdropFilter: "blur(12px)",
              }}
            >
              <GraduationCap className="h-4 w-4" />
              <span>Bachelor of Arts in Sociology</span>
              <Sparkles className="h-3.5 w-3.5" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.35 }}
              className="font-serif mt-6 max-w-5xl leading-[0.92] tracking-tight glow-heading"
              style={{
                fontSize: "clamp(3.5rem, 10vw, 7.5rem)",
                background: "linear-gradient(135deg, #ffffff 0%, #f9a8d4 40%, #e879f9 70%, #c084fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Kyla Kim C.
              <br />
              Sto. Domingo
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="mt-5 text-base sm:text-lg text-slate-300"
            >
              <Typewriter texts={loveNotes} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="mt-4 max-w-xl text-sm leading-8 text-slate-400 sm:text-base sm:leading-9"
            >
              A graduation page dressed like a private viewing — elegant, personal, and built
              around the woman who made every hard season look graceful.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="mt-9 flex flex-wrap items-center justify-center gap-4"
            >
              <a
                href="#gallery"
                className="btn-premium inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white"
              >
                <Camera className="h-4 w-4" />
                View Gallery
              </a>

              <motion.button
                type="button"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(12px)",
                }}
                whileHover={{
                  background: "rgba(244,114,182,0.12)",
                  borderColor: "rgba(244,114,182,0.35)",
                  scale: 1.02,
                }}
                onClick={() => setCelebrationOpen(true)}
              >
                <Heart className="h-4 w-4 text-pink-400" />
                Let&apos;s Celebrate
              </motion.button>
            </motion.div>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={heroLoaded ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 1.2 }}
              className="mt-10 flex flex-wrap justify-center gap-3"
            >
              {["Sociology", "Thesis Survivor", "Class of 2026", "Kyla Kim"].map((tag, i) => (
                <motion.span
                  key={tag}
                  className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-pink-300/70"
                  style={{
                    background: "rgba(244,114,182,0.06)",
                    border: "1px solid rgba(244,114,182,0.15)",
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.3 + i * 0.08 }}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </motion.section>

          {/* Scroll indicator */}
          <a
            href="#gallery"
            aria-label="Scroll to gallery"
            className="scroll-bounce absolute bottom-8 left-1/2 z-10"
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-full text-pink-300"
              style={{
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 0 20px rgba(244,114,182,0.15)",
              }}
            >
              <ChevronDown className="h-5 w-5" />
            </span>
          </a>
        </section>

        {/* ── GALLERY ──────────────────────────────────────────── */}
        <section
          id="gallery"
          className="relative overflow-hidden px-6 py-24 sm:px-8 lg:px-12"
          style={{
            background: "linear-gradient(180deg, #02040a 0%, #060716 15%, #060716 85%, #04050d 100%)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at top left, rgba(244,114,182,0.12) 0%, transparent 40%), radial-gradient(ellipse at 80% 10%, rgba(192,132,252,0.1) 0%, transparent 38%)",
            }}
          />

          <div className="relative mx-auto max-w-7xl">
            <RevealSection className="grid gap-6 lg:grid-cols-[1fr_0.55fr] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.4em] text-pink-400">
                  Private Gallery
                </p>
                <h2
                  className="font-serif mt-4 max-w-3xl font-light tracking-tight text-white glow-heading"
                  style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.1 }}
                >
                  The Kyla Kim{" "}
                  <span className="italic text-pink-300">Archive</span>
                </h2>
              </div>
              <p className="max-w-md text-sm leading-8 text-slate-400">
                A curated set of frames for the graduate who turned pressure, readings, fieldwork,
                and defense day into something unforgettable.
              </p>
            </RevealSection>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-12">
              {galleryPhotos.map((photo, i) => (
                <motion.button
                  key={photo.id}
                  type="button"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5, scale: 1.02, rotateX: 2, rotateY: -2 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  onClick={() => setSelectedPhoto(photo)}
                  className={`photo-card group grid gap-4 text-left ${photo.featured ? "lg:col-span-6" : "lg:col-span-4"
                    } sm:col-span-1`}
                  style={{ perspective: 1000 }}
                >
                  <span
                    className={`relative block overflow-hidden bg-[#10091c] transition-all duration-500 group-hover:-translate-y-2 ${photo.aspect === "landscape"
                      ? "aspect-[16/10]"
                      : photo.aspect === "square"
                        ? "aspect-square"
                        : "aspect-[4/5]"
                      }`}
                    style={{
                      borderRadius: "1.75rem",
                      border: "1px solid rgba(255,255,255,0.07)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    }}
                  >
                    <PhotoFallback label={photo.title} />
                    <SmartImage
                      src={photo.src}
                      alt={photo.alt}
                      sizes="(max-width: 768px) 92vw, (max-width: 1280px) 45vw, 560px"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    <span
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }}
                    />
                    <motion.span
                      className="absolute inset-0 rounded-[1.75rem] opacity-0 group-hover:opacity-100"
                      style={{
                        boxShadow: "inset 0 0 0 1px rgba(244,114,182,0.35)",
                        transition: "opacity 0.3s ease",
                      }}
                    />
                    {photo.featured && (
                      <span
                        className="absolute right-4 top-4 flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                        style={{
                          background: "rgba(244,114,182,0.25)",
                          backdropFilter: "blur(8px)",
                          border: "1px solid rgba(244,114,182,0.3)",
                        }}
                      >
                        <Star className="h-2.5 w-2.5" />
                        Featured
                      </span>
                    )}
                  </span>

                  <span className="grid gap-1 px-1">
                    <span className="font-serif text-xl font-semibold italic text-white transition-colors group-hover:text-pink-200">
                      {photo.title}
                    </span>
                    <span className="text-sm leading-6 text-slate-500 group-hover:text-slate-400 transition-colors">
                      {photo.caption}
                    </span>
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOVE LETTER ───────────────────────────────────────── */}
        <LoveLetterSection />

        {/* ── MILESTONES ────────────────────────────────────────── */}
        <section
          className="px-6 py-24 sm:px-8 lg:px-12"
          style={{ background: "linear-gradient(180deg, #04050d 0%, #030408 100%)" }}
        >
          <div className="mx-auto max-w-7xl">
            <RevealSection className="mb-14 flex items-end justify-between gap-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.4em] text-purple-400">
                  The Journey
                </p>
                <h2
                  className="font-serif mt-4 max-w-2xl font-light tracking-tight text-white"
                  style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", lineHeight: 1.15 }}
                >
                  Every chapter made this{" "}
                  <span className="italic text-purple-300">moment richer.</span>
                </h2>
              </div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 3 }}
              >
                <Crown className="hidden h-10 w-10 text-amber-400 md:block" />
              </motion.div>
            </RevealSection>

            <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Timeline connecting line (visible on large screens) */}
              <div className="absolute top-1/2 left-10 right-10 -translate-y-1/2 h-0.5 hidden lg:block pointer-events-none"
                   style={{
                     background: "linear-gradient(90deg, rgba(244,114,182,0) 0%, rgba(244,114,182,0.2) 20%, rgba(192,132,252,0.2) 80%, rgba(192,132,252,0) 100%)",
                     boxShadow: "0 0 10px rgba(244,114,182,0.2)"
                   }}
              />
              {milestones.map((item, i) => (
                <div key={item.title} className="relative z-10">
                  <MilestoneCard item={item} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CLOSING TOAST ─────────────────────────────────────── */}
        <section
          className="relative overflow-hidden px-6 py-28 text-center sm:px-8 lg:px-12"
          style={{
            background: "linear-gradient(180deg, #030408 0%, #080517 50%, #030408 100%)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, rgba(244,114,182,0.14) 0%, transparent 60%)",
            }}
          />

          {/* Decorative sparkles — deterministic positions */}
          {decorativeSparklePositions.map((pos, i) => (
            <motion.div
              key={i}
              className="pointer-events-none absolute"
              style={{ top: pos.top, left: pos.left }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.7,
              }}
            >
              <Sparkles className="h-4 w-4 text-pink-400/40" />
            </motion.div>
          ))}

          <RevealSection className="relative mx-auto max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-pink-400">
              Closing Toast
            </p>

            <h2
              className="font-serif mt-5 font-light tracking-tight"
              style={{
                fontSize: "clamp(2.5rem, 7vw, 5rem)",
                background: "linear-gradient(135deg, #ffffff, #f9a8d4, #e879f9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1.15,
              }}
            >
              You did not just finish.
              <br />
              <span className="italic">You arrived.</span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-9 text-slate-300 sm:text-base">
              Four years of sociology, revisions, readings, and hard days led here. I am proud of
              your mind, your discipline, and the way you kept becoming more yourself through all of it.
            </p>

            <div className="mt-4 flex justify-center gap-2 text-2xl">
              {["🌸", "✨", "💗", "🎓", "💜"].map((e, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                >
                  {e}
                </motion.span>
              ))}
            </div>

            <motion.button
              type="button"
              className="btn-premium mt-10 inline-flex items-center gap-2 rounded-full px-9 py-4 font-semibold text-white"
              onClick={() => setCelebrationOpen(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Flower2 className="h-4 w-4" />
              Celebrate Her
              <Heart className="h-4 w-4" />
            </motion.button>
          </RevealSection>
        </section>

        {/* ── FOOTER ────────────────────────────────────────────── */}
        <footer
          className="border-t px-6 py-8 text-center text-xs text-slate-600"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
        >
          <p>
            Made with{" "}
            <span className="text-pink-500 heartbeat inline-block">♥</span>{" "}
            for{" "}
            <span className="text-pink-400">Kyla Kim C. Sto. Domingo</span>
            {" · "}Class of 2026
          </p>
        </footer>
      </main>

      {/* ── OVERLAYS ──────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedPhoto && (
          <PhotoLightbox
            photo={selectedPhoto}
            onClose={() => setSelectedPhoto(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {celebrationOpen && (
          <CelebrationModal onClose={() => setCelebrationOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
