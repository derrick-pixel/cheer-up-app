// CheerUp — tiny localStorage "database". Works fully offline, out of the box.

export type TreatKind = "sweet" | "treat" | "coffee" | "milo";

export const TREATS: { kind: TreatKind; emoji: string; label: string; note: string }[] = [
  { kind: "sweet",  emoji: "🍬", label: "Sweet",  note: "a little sugar to soften the day" },
  { kind: "treat",  emoji: "🧁", label: "Treat",  note: "you deserve something nice" },
  { kind: "coffee", emoji: "☕", label: "Coffee", note: "a warm cup, on me" },
  { kind: "milo",   emoji: "🥤", label: "Milo",   note: "cozy malty comfort 🇸🇬" },
];

export type Treats = Record<TreatKind, number>;

export interface User {
  id: string;
  name: string;          // anonymous handle
  emoji: string;         // avatar
  color: string;         // avatar gradient css
  mood: string;          // how they're feeling
  bio: string;
  verified: boolean;     // "Verified via Interview"
  verifiedAt?: number;
  treats: Treats;
  createdAt: number;
}

export interface Message {
  id: string;
  toUserId: string;
  text: string;
  createdAt: number;     // fully anonymous — no sender stored
}

const K_USERS = "cheerup.users.v1";
const K_MSGS = "cheerup.messages.v1";
const K_ME = "cheerup.me.v1";
const K_SEEDED = "cheerup.seeded.v1";

export const AVATARS = ["🌻","🐣","🦋","🌈","🐳","🍀","⭐","🐥","🌸","🦦","🍓","🐧","🌼","🫧","🐝","🦔"];
export const GRADIENTS = [
  "linear-gradient(135deg,#FFD36A,#FF8A6B)",
  "linear-gradient(135deg,#A0E7C6,#5FC79A)",
  "linear-gradient(135deg,#FFC2D1,#FF8FB0)",
  "linear-gradient(135deg,#CDB4F6,#A084E8)",
  "linear-gradient(135deg,#9BE0FF,#6BB6FF)",
  "linear-gradient(135deg,#FFE08A,#FFB23E)",
];
export const MOODS = [
  "feeling small today","a bit lonely","running on empty","anxious but trying",
  "missing someone","tired of pretending","quietly hopeful","just need a hug",
];

function uid() { return Math.random().toString(36).slice(2, 10); }
const emptyTreats = (): Treats => ({ sweet: 0, treat: 0, coffee: 0, milo: 0 });

function read<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; }
  catch { return fallback; }
}
function write<T>(key: string, v: T) { localStorage.setItem(key, JSON.stringify(v)); }

// ── seed a warm, alive community on first load ──
function seed() {
  if (localStorage.getItem(K_SEEDED)) return;
  const now = Date.now();
  const u = (i: number, name: string, emoji: string, mood: string, bio: string, verified: boolean, t: Partial<Treats>): User => ({
    id: "seed_" + i, name, emoji, color: GRADIENTS[i % GRADIENTS.length], mood, bio,
    verified, verifiedAt: verified ? now : undefined, treats: { ...emptyTreats(), ...t }, createdAt: now - i * 36e5,
  });
  const users: User[] = [
    u(1, "QuietRiver", "🌊", "running on empty", "Some days are heavier than others. Thanks for being here.", true, { sweet: 6, coffee: 3, milo: 2 }),
    u(2, "PaperPlane", "✈️", "a bit lonely", "Trying to be brave. A kind word goes a long way.", true, { treat: 4, sweet: 2 }),
    u(3, "SoftMoon", "🌙", "anxious but trying", "I overthink everything. Be gentle with me 🤍", false, { milo: 1 }),
    u(4, "TinySprout", "🌱", "quietly hopeful", "Growing slowly. Every bit of cheer helps me bloom.", true, { sweet: 9, treat: 5, coffee: 4, milo: 7 }),
    u(5, "LostSock", "🧦", "tired of pretending", "Smiling on the outside. Could use a real one today.", false, { coffee: 1 }),
    u(6, "WarmTea", "🍵", "just need a hug", "New here. Hi 👋 hope today is kind to you too.", false, {} as Partial<Treats>),
  ];
  const msgs: Message[] = [
    { id: uid(), toUserId: "seed_1", text: "You are doing so much better than you think. Keep going 💛", createdAt: now - 2e5 },
    { id: uid(), toUserId: "seed_1", text: "The world is softer with you in it.", createdAt: now - 9e5 },
    { id: uid(), toUserId: "seed_4", text: "Look how far you've grown already. So proud of you 🌱", createdAt: now - 1e5 },
    { id: uid(), toUserId: "seed_2", text: "You are braver than yesterday and that counts.", createdAt: now - 4e5 },
  ];
  write(K_USERS, users); write(K_MSGS, msgs);
  localStorage.setItem(K_SEEDED, "1");
}

// ── public api ──
export function getUsers(): User[] { seed(); return read<User[]>(K_USERS, []); }
export function getUser(id: string | null): User | undefined { if (!id) return undefined; return getUsers().find(u => u.id === id); }
export function getMe(): User | undefined { return getUser(localStorage.getItem(K_ME)); }
export function getMessagesFor(id: string): Message[] {
  seed();
  return read<Message[]>(K_MSGS, []).filter(m => m.toUserId === id).sort((a, b) => b.createdAt - a.createdAt);
}
export function totalTreats(u: User): number { return u.treats.sweet + u.treats.treat + u.treats.coffee + u.treats.milo; }

export function createMe(p: { name: string; emoji: string; color: string; mood: string; bio: string }): User {
  const users = getUsers();
  const me: User = { id: "me_" + uid(), ...p, verified: false, treats: emptyTreats(), createdAt: Date.now() };
  users.unshift(me); write(K_USERS, users); localStorage.setItem(K_ME, me.id);
  return me;
}

export function sendTreat(toId: string, kind: TreatKind) {
  const users = getUsers(); const u = users.find(x => x.id === toId); if (!u) return;
  u.treats[kind] = (u.treats[kind] || 0) + 1; write(K_USERS, users);
}

export function sendMessage(toId: string, text: string): Message {
  const msgs = read<Message[]>(K_MSGS, []);
  const m: Message = { id: uid(), toUserId: toId, text: text.trim(), createdAt: Date.now() };
  msgs.unshift(m); write(K_MSGS, msgs); return m;
}

// ── mock admin "interview" verification ──
export function setVerified(id: string, verified: boolean) {
  const users = getUsers(); const u = users.find(x => x.id === id); if (!u) return;
  u.verified = verified; u.verifiedAt = verified ? Date.now() : undefined; write(K_USERS, users);
}

export function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
