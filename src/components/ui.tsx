import confetti from "canvas-confetti";
import type { User } from "../lib/store";
import { TREATS, totalTreats } from "../lib/store";

export function Avatar({ user, size = 56 }: { user: Pick<User, "emoji" | "color">; size?: number }) {
  return (
    <span
      className="inline-grid place-items-center rounded-full shrink-0 shadow-inner"
      style={{ width: size, height: size, background: user.color, fontSize: size * 0.5, boxShadow: "inset 0 -4px 10px rgba(0,0,0,.08), 0 4px 12px -4px rgba(180,120,70,.4)" }}
    >
      <span style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,.15))" }}>{user.emoji}</span>
    </span>
  );
}

export function VerifiedBadge({ verified, small = false }: { verified: boolean; small?: boolean }) {
  if (verified) {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full font-semibold text-sage-deep bg-sage/15 ring-1 ring-sage/40 ${small ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"}`}>
        <span aria-hidden>🛡️</span> Verified via Interview
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold text-ink-soft bg-ink/5 ring-1 ring-ink/10 ${small ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"}`}>
      <span aria-hidden>⏳</span> Pending interview
    </span>
  );
}

export function TreatStat({ user, size = "md" }: { user: User; size?: "sm" | "md" }) {
  const items = TREATS.filter(t => user.treats[t.kind] > 0);
  if (items.length === 0) {
    return <p className="text-ink-soft text-sm">No treats yet — be the first to brighten their day ✨</p>;
  }
  return (
    <div className={`flex flex-wrap gap-2 ${size === "sm" ? "text-sm" : ""}`}>
      {items.map(t => (
        <span key={t.kind} className="inline-flex items-center gap-1.5 rounded-full bg-white/70 ring-1 ring-black/5 px-3 py-1 font-bold text-ink shadow-sm">
          <span aria-hidden>{t.emoji}</span>
          {user.treats[t.kind]}
        </span>
      ))}
    </div>
  );
}

export function bigCount(user: User) { return totalTreats(user); }

// ── celebrations ──
const WARM = ["#FFB23E", "#FF7A6B", "#FFD36A", "#B084E8", "#5FC79A", "#FF8FB0"];

export function celebrateTreat(emoji: string) {
  try {
    const shape = (confetti as any).shapeFromText ? (confetti as any).shapeFromText({ text: emoji, scalar: 2.2 }) : undefined;
    confetti({ particleCount: 26, spread: 70, startVelocity: 38, origin: { y: 0.7 }, scalar: 1.1, colors: WARM, shapes: shape ? [shape] : undefined });
    confetti({ particleCount: 50, spread: 90, startVelocity: 30, origin: { y: 0.7 }, colors: WARM });
  } catch { /* confetti is best-effort */ }
}

export function celebrateKind() {
  try {
    const heart = (confetti as any).shapeFromText ? (confetti as any).shapeFromText({ text: "💛", scalar: 2 }) : undefined;
    const burst = (x: number) => confetti({ particleCount: 22, spread: 60, startVelocity: 34, origin: { x, y: 0.75 }, scalar: 1.1, colors: WARM, shapes: heart ? [heart] : undefined });
    burst(0.3); setTimeout(() => burst(0.7), 120);
  } catch { /* noop */ }
}
