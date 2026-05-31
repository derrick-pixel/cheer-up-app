import { useState } from "react";
import { getUsers, setVerified, timeAgo, type User } from "../lib/store";
import { Avatar, VerifiedBadge } from "./ui";

// Mock "Interview / Verification" panel — the community safety shield.
// Demo passcode keeps it feeling real without any backend.
const PASSCODE = "kind";

export default function Admin() {
  const [ok, setOk] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  const [, force] = useState(0);

  if (!ok) {
    return (
      <div className="px-5 pt-12 max-w-md mx-auto">
        <div className="card p-7 text-center pop-in">
          <div className="text-5xl anim-sway inline-block">🛡️</div>
          <h1 className="font-display text-2xl font-bold mt-2">Interview Panel</h1>
          <p className="text-ink-soft mt-1">For our trust &amp; safety team. We interview every member before verifying them — that's how we keep scammers out and keep this place gentle.</p>
          <input value={code} onChange={e => { setCode(e.target.value); setErr(false); }}
            placeholder="team passcode" type="password"
            className={`w-full mt-4 text-center rounded-2xl bg-white/85 px-4 py-3 outline-none ring-2 ${err ? "ring-coral" : "ring-black/5 focus:ring-sun"}`} />
          {err && <p className="text-coral text-sm font-bold mt-1">That's not it. (psst — demo code is "kind")</p>}
          <button onClick={() => (code.trim().toLowerCase() === PASSCODE ? setOk(true) : setErr(true))}
            className="btn-pop btn-sun w-full font-display font-bold rounded-2xl py-3 mt-3">Unlock panel</button>
          <p className="text-ink-soft text-xs mt-3">Demo passcode: <b>kind</b></p>
        </div>
      </div>
    );
  }

  const users = getUsers();
  const pending = users.filter(u => !u.verified);
  const verified = users.filter(u => u.verified);

  function toggle(u: User) { setVerified(u.id, !u.verified); force(n => n + 1); }

  return (
    <div className="px-5 pt-8 pb-8 max-w-md mx-auto">
      <h1 className="font-display text-3xl font-bold leading-tight">Interview Panel 🛡️</h1>
      <p className="text-ink-soft font-semibold mt-0.5">Verify real, kind humans. Keep the scammers out.</p>

      <div className="flex gap-3 mt-4">
        <Stat label="Awaiting interview" value={pending.length} tone="warn" />
        <Stat label="Verified members" value={verified.length} tone="good" />
      </div>

      <p className="font-display font-semibold text-lg mt-6 mb-2">Awaiting interview ⏳</p>
      <div className="grid gap-2.5">
        {pending.length === 0 && <p className="card p-4 text-center text-ink-soft">All caught up — everyone's verified 🎉</p>}
        {pending.map(u => <Row key={u.id} u={u} onToggle={toggle} />)}
      </div>

      <p className="font-display font-semibold text-lg mt-6 mb-2">Verified ✅</p>
      <div className="grid gap-2.5">
        {verified.map(u => <Row key={u.id} u={u} onToggle={toggle} />)}
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "warn" | "good" }) {
  return (
    <div className={`card flex-1 p-4 ${tone === "good" ? "ring-sage/30" : ""}`}>
      <p className="font-display text-3xl font-extrabold leading-none">{value}</p>
      <p className="text-ink-soft text-xs font-semibold mt-1">{label}</p>
    </div>
  );
}

function Row({ u, onToggle }: { u: User; onToggle: (u: User) => void }) {
  return (
    <div className="card p-3.5 flex items-center gap-3">
      <Avatar user={u} size={48} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display font-bold leading-none">{u.name}</span>
          <VerifiedBadge verified={u.verified} small />
        </div>
        <p className="text-ink-soft text-xs mt-0.5">joined {timeAgo(u.createdAt)} · "{u.mood}"</p>
      </div>
      <button onClick={() => onToggle(u)}
        className={`btn-pop rounded-full px-3.5 py-2 text-sm font-bold shrink-0 ${u.verified ? "bg-ink/5 text-ink-soft ring-1 ring-ink/10" : "btn-sun"}`}>
        {u.verified ? "Revoke" : "✓ Verify"}
      </button>
    </div>
  );
}
