"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Award, ExternalLink } from "lucide-react";

// ── Blood drop particle physics ───────────────────────────────────────────────
interface Drop {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  gravity: number;
  life: number;
  maxLife: number;
}

function useBloodPhysics() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const idRef = useRef(0);
  const rafRef = useRef<number>(0);
  const dropsRef = useRef<Drop[]>([]);

  const tick = useCallback(() => {
    dropsRef.current = dropsRef.current
      .map((d) => ({
        ...d,
        x: d.x + d.vx,
        y: d.y + d.vy,
        vy: d.vy + d.gravity,
        vx: d.vx * 0.97,
        rotation: d.rotation + d.rotationSpeed,
        life: d.life - 1,
        opacity: Math.max(0, (d.life / d.maxLife) * d.opacity),
        size: d.size * (0.97 + (d.life / d.maxLife) * 0.03),
      }))
      .filter((d) => d.life > 0);

    setDrops([...dropsRef.current]);

    if (dropsRef.current.length > 0) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  const burst = useCallback(
    (x: number, y: number) => {
      const count = 14;
      const newDrops: Drop[] = Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const speed = 1.5 + Math.random() * 3.5;
        const life = 40 + Math.floor(Math.random() * 30);
        return {
          id: idRef.current++,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 2,
          size: 4 + Math.random() * 7,
          opacity: 0.7 + Math.random() * 0.3,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 12,
          gravity: 0.12 + Math.random() * 0.08,
          life,
          maxLife: life,
        };
      });

      dropsRef.current = [...dropsRef.current, ...newDrops];
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);
    },
    [tick]
  );

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return { drops, burst };
}

// ── Blood drop SVG shape ──────────────────────────────────────────────────────
function BloodDrop({
  drop,
  containerRect,
}: {
  drop: Drop;
  containerRect: DOMRect | null;
}) {
  if (!containerRect) return null;
  const cx = drop.x;
  const cy = drop.y;
  const r = drop.size / 2;

  return (
    <svg
      style={{
        position: "fixed",
        left: cx - r * 2,
        top: cy - r * 2,
        width: r * 4,
        height: r * 5,
        pointerEvents: "none",
        zIndex: 9999,
        opacity: drop.opacity,
        transform: `rotate(${drop.rotation}deg)`,
        filter: `drop-shadow(0 2px 4px rgba(185,28,28,0.5))`,
        transition: "none",
      }}
      viewBox="0 0 40 52"
    >
      <defs>
        <radialGradient id={`g${drop.id}`} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>
      </defs>
      <path
        d="M20 2 C20 2, 36 22, 36 32 A16 16 0 0 1 4 32 C4 22, 20 2, 20 2 Z"
        fill={`url(#g${drop.id})`}
      />
      <ellipse cx="14" cy="24" rx="4" ry="6" fill="rgba(255,255,255,0.25)" transform="rotate(-15,14,24)" />
    </svg>
  );
}

// ── Animated hamburger icon ───────────────────────────────────────────────────
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <style>{`
        .hb-line { transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1); transform-origin: center; }
      `}</style>
      <line
        className="hb-line"
        x1="3" y1="7" x2="19" y2="7"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
        style={{
          transform: open ? "translateY(4px) rotate(45deg)" : "translateY(0) rotate(0deg)",
          transformOrigin: "11px 7px",
        }}
      />
      <line
        className="hb-line"
        x1="3" y1="11" x2="19" y2="11"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
        style={{
          opacity: open ? 0 : 1,
          transform: open ? "scaleX(0)" : "scaleX(1)",
          transformOrigin: "11px 11px",
        }}
      />
      <line
        className="hb-line"
        x1="7" y1="15" x2="19" y2="15"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
        style={{
          transform: open ? "translateY(-4px) rotate(-45deg)" : "translateY(0) rotate(0deg)",
          transformOrigin: "11px 15px",
        }}
      />
    </svg>
  );
}

function NavLink({
  href,
  label,
  index,
  onClick,
}: {
  href: string;
  label: string;
  index: number;
  onClick: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="group relative flex items-center px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 overflow-hidden"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <span
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: "color-mix(in srgb, var(--color-primary, #dc2626) 8%, transparent)" }}
      />
      <span
        className="relative mr-3 w-0.5 h-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
        style={{ backgroundColor: "var(--color-primary, #dc2626)" }}
      />
      <span className="relative">{label}</span>
      <span
        className="absolute bottom-2 left-4 right-4 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
        style={{ backgroundColor: "var(--color-primary, #dc2626)", opacity: 0.4 }}
      />
    </a>
  );
}

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [pressed, setPressed] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { drops, burst } = useBloodPhysics();
  const [btnRect, setBtnRect] = useState<DOMRect | null>(null);

  function handleClick() {
    const rect = btnRef.current!.getBoundingClientRect();
    setBtnRect(rect);
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    burst(cx, cy);
    setOpen((v) => !v);
  }

  useEffect(() => {
    if (!open) return;
    function onOutside(e: MouseEvent) {
      if (btnRef.current && !btnRef.current.closest("nav")?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  const links = [
    { href: "#search",       label: "রক্তদাতা খুঁজুন" },
    { href: "#donor-form",   label: "নিবন্ধন করুন" },
    { href: "#request-form", label: "রক্ত চান" },
  ];

  return (
    <>
      <style>{`
        @keyframes menu-reveal {
          from { opacity: 0; transform: translateY(-10px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes link-slide {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .menu-animate { animation: menu-reveal 0.3s cubic-bezier(0.16,1,0.3,1) forwards; }
        .link-animate { animation: link-slide 0.3s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      {drops.map((drop) => (
        <BloodDrop key={drop.id} drop={drop} containerRect={btnRect} />
      ))}

      <button
        ref={btnRef}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onClick={handleClick}
        className="md:hidden relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 text-gray-600 dark:text-gray-300"
        style={{
          backgroundColor: open ? "rgba(220, 38, 38, 0.12)" : "transparent",
          transform: pressed ? "scale(0.92)" : "scale(1)",
        }}
      >
        <HamburgerIcon open={open} />
      </button>

      {open && (
        <div
          className="menu-animate md:hidden absolute top-[65px] left-3 right-3 z-50 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl"
        >
          <div className="p-2">
            {links.map((link, i) => (
              <div key={link.href} className="link-animate" style={{ animationDelay: `${i * 55}ms` }}>
                <NavLink href={link.href} label={link.label} index={i} onClick={() => setOpen(false)} />
              </div>
            ))}

            <div className="my-2 mx-4 h-px bg-gray-100 dark:bg-gray-800" />

            {/* Admin Link */}
            <div className="link-animate p-1" style={{ animationDelay: "165ms" }}>
              <a
                href="/admin"
                onClick={() => setOpen(false)}
                className="group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-red-600 overflow-hidden"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                <span>Admin Panel</span>
              </a>
            </div>

            {/* Developer Section */}
            <div className="link-animate p-1" style={{ animationDelay: "220ms" }}>
              <a 
                href="/developer" 
                onClick={() => setOpen(false)}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 mt-2 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-[10px] font-black shadow-sm">
                    T
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">ডেভেলপার প্রোফাইল</p>
                    <p className="text-[9px] text-gray-500 uppercase">Profile Details</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-red-600" />
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
