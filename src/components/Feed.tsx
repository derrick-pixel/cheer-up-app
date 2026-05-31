import { useState } from "react";
import { getUsers, totalTreats, type User } from "../lib/store";
import { Avatar, VerifiedBadge } from "./ui";

export default function Feed({ me, onOpen }: { me: User; onOpen: (id: string) => void }) {
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const all = getUsers().filter(u => u.id !== me.id);
  const list = verifiedOnly ? all.filter(u => u.verified) : all;
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="px-5 pt-8 max-w-md mx-auto">
      <div className="pop-in">
        <p className="text-ink-soft font-semibold">{greet}, <span className="text-ink">{me.name}</span> 🌷</p>
        <h1 className="font-display text-3xl font-bold leading-tight mt-0.5">
          Someone here could use <span className="text-sunrise">your kindness</span>.
        </h1>
      </div>

      <div className="flex items-center justify-between mt-5 mb-3">
        <p className="font-display font-semibold text-lg">People to cheer up</p>
        <button onClick={() => setVerifiedOnly(v => !v)}
          className={`btn-pop rounded-full px-3 py-1.5 text-xs font-bold ${verifiedOnly ? "bg-sage/20 ring-1 ring-sage text-sage-deep" : "bg-white/60 ring-1 ring-black/5 text-ink-soft"}`}>
          🛡️ Verified only
        </button>
      </div>

      <div className="grid gap-3.5 stagger">
        {list.map(u => <PersonCard key={u.id} u={u} onOpen={onOpen} />)}
        {list.length === 0 && <p className="text-ink-soft text-center py-10">No one here yet. 🤍</p>}
      </div>
    </div>
  );
}

function PersonCard({ u, onOpen }: { u: User; onOpen: (id: string) => void }) {
  return (
    <button onClick={() => onOpen(u.id)} className="btn-pop card p-4 text-left w-full hover:-translate-y-0.5 active:translate-y-0">
      <div className="flex items-start gap-3.5">
        <Avatar user={u} size={56} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-lg leading-none">{u.name}</span>
            <VerifiedBadge verified={u.verified} small />
          </div>
          <p className="text-coral font-semibold text-sm mt-0.5">{u.mood}</p>
          {u.bio && <p className="text-ink-soft text-sm mt-1 line-clamp-2">{u.bio}</p>}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pl-[70px]">
        <span className="text-ink-soft text-sm font-semibold">
          {totalTreats(u) > 0 ? <>🎁 {totalTreats(u)} treats received</> : <>✨ no treats yet</>}
        </span>
        <span className="inline-flex items-center gap-1 font-display font-bold text-sun-deep text-sm">Cheer up →</span>
      </div>
    </button>
  );
}
