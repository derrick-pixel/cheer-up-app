import { useMemo, useState } from "react";
import { TREATS, getUser, getMessagesFor, sendTreat, sendMessage, timeAgo, totalTreats, type TreatKind } from "../lib/store";
import { checkKindness, randomStarter } from "../lib/kindness";
import { Avatar, VerifiedBadge, TreatStat, celebrateTreat, celebrateKind } from "./ui";

export default function Profile({ userId, meId, onBack }: { userId: string; meId: string; onBack: () => void }) {
  const [tick, setTick] = useState(0);
  const refresh = () => setTick(t => t + 1);
  const u = useMemo(() => getUser(userId), [userId, tick]);
  const msgs = useMemo(() => getMessagesFor(userId), [userId, tick]);
  const [toast, setToast] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const isMe = userId === meId;

  if (!u) return <div className="p-8 text-center text-ink-soft">This person flew away 🕊️</div>;

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 1900); }

  function treat(kind: TreatKind, emoji: string, label: string) {
    sendTreat(userId, kind); celebrateTreat(emoji); refresh();
    flash(`${emoji} ${label} sent to ${u!.name}!`);
  }

  return (
    <div className="px-5 pt-6 pb-8 max-w-md mx-auto">
      <button onClick={onBack} className="btn-pop rounded-full bg-white/70 ring-1 ring-black/5 px-3.5 py-1.5 font-bold text-sm text-ink-soft">← back</button>

      {/* hero */}
      <div className="card p-6 mt-4 text-center pop-in">
        <div className="anim-float inline-block"><Avatar user={u} size={92} /></div>
        <h1 className="font-display text-3xl font-bold mt-2">{u.name}</h1>
        <p className="text-coral font-bold">{u.mood}</p>
        <div className="mt-2 flex justify-center"><VerifiedBadge verified={u.verified} /></div>
        {u.bio && <p className="text-ink-soft mt-3 leading-relaxed">{u.bio}</p>}
        <div className="mt-4 flex justify-center"><TreatStat user={u} /></div>
        <p className="text-ink-soft text-xs mt-3 font-semibold">🎁 {totalTreats(u)} little treats received in total</p>
      </div>

      {!isMe && (
        <>
          {/* treats */}
          <p className="font-display font-semibold text-lg mt-6 mb-2">Send {u.name} a treat 🎁</p>
          <div className="grid grid-cols-2 gap-3">
            {TREATS.map(t => (
              <button key={t.kind} onClick={() => treat(t.kind, t.emoji, t.label)}
                className="btn-pop card p-3.5 flex items-center gap-3 text-left active:translate-y-0.5">
                <span className="text-3xl" aria-hidden>{t.emoji}</span>
                <span>
                  <span className="font-display font-bold block leading-tight">{t.label}</span>
                  <span className="text-ink-soft text-xs leading-tight">{t.note}</span>
                </span>
              </button>
            ))}
          </div>

          {/* kind message cta */}
          <button onClick={() => setComposeOpen(true)} className="btn-pop btn-sun w-full font-display font-bold text-lg rounded-2xl py-3.5 mt-4">
            💌 Write a kind message
          </button>
        </>
      )}

      {/* received cheers */}
      <p className="font-display font-semibold text-lg mt-7 mb-2">
        {isMe ? "Cheers you've received 💛" : `Kind words ${u.name} has received`}
      </p>
      <div className="grid gap-2.5 stagger">
        {msgs.length === 0 && <p className="card p-5 text-center text-ink-soft">No messages yet — a kind word would mean the world here. 🤍</p>}
        {msgs.map(m => (
          <div key={m.id} className="card p-4">
            <p className="leading-relaxed">{m.text}</p>
            <p className="text-ink-soft text-xs mt-2 font-semibold">— a kind stranger · {timeAgo(m.createdAt)}</p>
          </div>
        ))}
      </div>

      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-50 pop-in">
          <div className="bg-ink text-cream font-bold rounded-full px-5 py-2.5 shadow-xl">{toast}</div>
        </div>
      )}

      {composeOpen && <Compose name={u.name} onClose={() => setComposeOpen(false)}
        onSend={(text) => { sendMessage(userId, text); celebrateKind(); refresh(); setComposeOpen(false); flash("💌 Your kindness is on its way!"); }} />}
    </div>
  );
}

function Compose({ name, onSend, onClose }: { name: string; onSend: (t: string) => void; onClose: () => void }) {
  const [text, setText] = useState("");
  const check = checkKindness(text);
  const touched = text.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-ink/30 backdrop-blur-sm" onClick={onClose}>
      <div className="card p-5 w-full max-w-md pop-in" onClick={e => e.stopPropagation()} style={{ borderRadius: 30 }}>
        <div className="flex items-center justify-between">
          <p className="font-display font-bold text-xl">A kind word for {name}</p>
          <button onClick={onClose} className="btn-pop text-ink-soft text-2xl leading-none" aria-label="close">×</button>
        </div>
        <p className="text-ink-soft text-sm">Only warmth gets through here. 💛</p>

        <textarea autoFocus value={text} onChange={e => setText(e.target.value)} maxLength={240} rows={3}
          placeholder="Tell them something gentle and true…"
          className={`w-full mt-3 rounded-2xl bg-white/85 px-4 py-3 outline-none resize-none ring-2 ${touched && !check.ok ? "ring-coral" : "ring-black/5 focus:ring-sun"}`} />

        <div className="flex flex-wrap gap-1.5 mt-2">
          {[randomStarter(), randomStarter()].filter((v, i, a) => a.indexOf(v) === i).map(s => (
            <button key={s} onClick={() => setText(s)} className="btn-pop rounded-full bg-peach/70 ring-1 ring-black/5 px-3 py-1 text-xs font-semibold text-ink">{s}</button>
          ))}
        </div>

        {/* kindness guard feedback */}
        <div className="mt-3 min-h-[44px]">
          {!touched && <p className="text-ink-soft text-sm flex items-center gap-2">🛡️ <span>Our kindness shield blocks anything unkind before it's sent.</span></p>}
          {touched && check.ok && <p className="text-sage-deep text-sm font-bold flex items-center gap-2 bg-sage/10 rounded-xl px-3 py-2 ring-1 ring-sage/30">✅ This is lovely — ready to send.</p>}
          {touched && !check.ok && check.reason === "unkind" && (
            <p className="text-coral text-sm font-bold flex items-center gap-2 bg-coral/10 rounded-xl px-3 py-2 ring-1 ring-coral/30">
              🚫 <span>"{check.word}" isn't very kind. This is a soft space — try lifting them up instead.</span>
            </p>)}
          {touched && !check.ok && check.reason === "shouting" && (
            <p className="text-coral text-sm font-bold bg-coral/10 rounded-xl px-3 py-2 ring-1 ring-coral/30">🔉 Maybe gentler than all-caps? A soft voice is kinder.</p>)}
          {touched && !check.ok && check.reason === "empty" && (
            <p className="text-ink-soft text-sm">Write a little something 🤍</p>)}
        </div>

        <button disabled={!check.ok} onClick={() => onSend(text)}
          className={`btn-pop w-full font-display font-bold text-lg rounded-2xl py-3.5 mt-1 ${check.ok ? "btn-sun" : "bg-black/10 text-ink-soft cursor-not-allowed"}`}>
          {check.ok ? "Send the warmth 💛" : "Add something kind"}
        </button>
      </div>
    </div>
  );
}
