import { useEffect, useState } from "react";
import { getMe, type User } from "./lib/store";
import { Avatar } from "./components/ui";
import Onboarding from "./components/Onboarding";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import Inbox from "./components/Inbox";
import Admin from "./components/Admin";

type View = "feed" | "profile" | "inbox" | "admin";

export default function App() {
  const [me, setMe] = useState<User | undefined>(() => getMe());
  const [view, setView] = useState<View>("feed");
  const [openId, setOpenId] = useState<string | null>(null);

  // keep `me` fresh whenever we navigate (treats / verification may have changed)
  useEffect(() => { setMe(getMe()); }, [view, openId]);

  if (!me) return <Onboarding onDone={() => { setMe(getMe()); setView("feed"); }} />;

  const go = (v: View) => { setOpenId(null); setView(v); };
  const openProfile = (id: string) => { setOpenId(id); setView("profile"); };

  return (
    <div className="min-h-screen pb-24">
      <div className="pointer-events-none fixed -top-24 -left-16 w-72 h-72 rounded-full blur-3xl opacity-50" style={{ background: "radial-gradient(circle,#FFD36A,transparent 70%)" }} />

      {view === "feed" && <Feed me={me} onOpen={openProfile} />}
      {view === "profile" && openId && <Profile userId={openId} meId={me.id} onBack={() => go("feed")} />}
      {view === "inbox" && <Inbox me={me} />}
      {view === "admin" && <Admin />}

      <BottomNav view={view} openId={openId} me={me}
        onHome={() => go("feed")}
        onInbox={() => go("inbox")}
        onMe={() => openProfile(me.id)}
        onAdmin={() => go("admin")} />
    </div>
  );
}

function BottomNav({ view, openId, me, onHome, onInbox, onMe, onAdmin }: {
  view: View; openId: string | null; me: User;
  onHome: () => void; onInbox: () => void; onMe: () => void; onAdmin: () => void;
}) {
  const onMeTab = view === "profile" && openId === me.id;
  const item = (active: boolean) =>
    `btn-pop flex-1 flex flex-col items-center gap-0.5 py-2 rounded-2xl font-bold text-[11px] ${active ? "text-sun-deep" : "text-ink-soft"}`;
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 px-3 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto mb-3 card flex items-center gap-1 px-2 py-1.5" style={{ borderRadius: 26 }}>
        <button onClick={onHome} className={item(view === "feed")}><span className="text-xl">🏡</span>Home</button>
        <button onClick={onInbox} className={item(view === "inbox")}><span className="text-xl">💌</span>Inbox</button>
        <button onClick={onMe} className={item(onMeTab)}>
          <span className={`rounded-full ${onMeTab ? "ring-2 ring-sun" : ""}`}><Avatar user={me} size={24} /></span>Me
        </button>
        <button onClick={onAdmin} className={item(view === "admin")}><span className="text-xl">🛡️</span>Shield</button>
      </div>
    </nav>
  );
}
