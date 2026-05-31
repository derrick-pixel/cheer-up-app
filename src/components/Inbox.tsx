import { getMessagesFor, timeAgo, totalTreats, TREATS, type User } from "../lib/store";
import { Avatar, VerifiedBadge } from "./ui";

export default function Inbox({ me }: { me: User }) {
  const msgs = getMessagesFor(me.id);
  const treats = totalTreats(me);

  return (
    <div className="px-5 pt-8 pb-8 max-w-md mx-auto">
      <div className="pop-in">
        <h1 className="font-display text-3xl font-bold leading-tight">Your warm corner ☀️</h1>
        <p className="text-ink-soft font-semibold mt-0.5">Everything kind that's found its way to you.</p>
      </div>

      {/* me snapshot */}
      <div className="card p-5 mt-5 flex items-center gap-4 pop-in">
        <Avatar user={me} size={64} />
        <div className="min-w-0">
          <p className="font-display font-bold text-xl leading-tight">{me.name}</p>
          <div className="mt-1"><VerifiedBadge verified={me.verified} small /></div>
        </div>
      </div>

      {/* treats received */}
      <p className="font-display font-semibold text-lg mt-6 mb-2">Treats you've been given 🎁</p>
      <div className="grid grid-cols-4 gap-2.5">
        {TREATS.map(t => (
          <div key={t.kind} className="card py-3 grid place-items-center">
            <span className="text-2xl" aria-hidden>{t.emoji}</span>
            <span className="font-display font-extrabold text-lg leading-none mt-1">{me.treats[t.kind]}</span>
            <span className="text-ink-soft text-[11px]">{t.label}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-ink-soft text-sm mt-2 font-semibold">{treats} little treats so far 💛</p>

      {/* messages */}
      <p className="font-display font-semibold text-lg mt-7 mb-2">Kind messages 💌</p>
      <div className="grid gap-2.5 stagger">
        {msgs.length === 0 && (
          <div className="card p-6 text-center">
            <div className="text-4xl anim-float inline-block">📭</div>
            <p className="font-display font-bold mt-2">No messages yet — but they're coming.</p>
            <p className="text-ink-soft text-sm mt-1">In the meantime, cheering someone else up is a lovely way to feel better too.</p>
          </div>
        )}
        {msgs.map(m => (
          <div key={m.id} className="card p-4">
            <p className="leading-relaxed text-lg">{m.text}</p>
            <p className="text-ink-soft text-xs mt-2 font-semibold">— a kind stranger · {timeAgo(m.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
