// Kindness-only guard. Front-end filter that blocks unkind words and
// nudges people toward warmth. (Not a substitute for real moderation —
// but a clear, friendly shield that keeps the tone soft.)

const UNKIND = [
  "ugly","stupid","idiot","dumb","loser","worthless","useless","hate","kill",
  "die","trash","garbage","pathetic","fat","disgust","shut up","nobody likes",
  "freak","weird","annoying","cringe","failure","fail","gross","creep","scam",
  "scammer","fraud","damn","hell","suck","sucks","awful","terrible","horrible",
  "boring","unlovable","give up","worst","nasty","jerk","fool","coward",
];

// soft self-harm / crisis signals → we don't "block" these as unkind, we respond with care
const CRISIS = ["kill myself","end it all","want to die","hurt myself","suicide","no reason to live"];

export interface KindCheck {
  ok: boolean;
  reason?: "empty" | "unkind" | "shouting";
  word?: string;
  crisis?: boolean;
}

export function checkKindness(raw: string): KindCheck {
  const text = raw.trim();
  if (!text) return { ok: false, reason: "empty" };

  const lower = " " + text.toLowerCase().replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ") + " ";

  const crisis = CRISIS.some(p => lower.includes(" " + p + " ") || text.toLowerCase().includes(p));

  for (const w of UNKIND) {
    const needle = w.includes(" ") ? w : ` ${w} `;
    if (w.includes(" ") ? lower.includes(w) : lower.includes(needle)) {
      return { ok: false, reason: "unkind", word: w, crisis };
    }
  }

  // all-caps shouting (long words only)
  const shout = text.replace(/[^A-Za-z]/g, "");
  if (shout.length > 8 && shout === shout.toUpperCase()) {
    return { ok: false, reason: "shouting", crisis };
  }

  return { ok: true, crisis };
}

export const KIND_STARTERS = [
  "You matter more than you know 💛",
  "The world is brighter with you in it 🌎",
  "You're doing better than you think. Keep going 🌱",
  "Sending you the biggest, gentlest hug 🤗",
  "You are enough, exactly as you are 🤍",
  "Tough days don't last. You do. ⭐",
  "Whatever you're carrying, you're not carrying it alone.",
  "Proud of you for showing up today 🌻",
];

export function randomStarter(): string {
  return KIND_STARTERS[Math.floor(Math.random() * KIND_STARTERS.length)];
}
