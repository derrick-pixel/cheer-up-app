import { useState } from "react";
import { AVATARS, GRADIENTS, MOODS, createMe } from "../lib/store";
import { Avatar } from "./ui";

const ADJ = ["Soft","Quiet","Brave","Gentle","Warm","Tiny","Hopeful","Sleepy","Kind","Cosy","Velvet","Sunny"];
const NOUN = ["Cloud","Sparrow","Pebble","Lantern","Maple","Otter","Comet","Willow","Marble","Pumpkin","Robin","Harbour"];
const handle = () => ADJ[Math.floor(Math.random()*ADJ.length)] + NOUN[Math.floor(Math.random()*NOUN.length)];

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState(handle);
  const [emoji, setEmoji] = useState(AVATARS[0]);
  const [color, setColor] = useState(GRADIENTS[0]);
  const [mood, setMood] = useState(MOODS[0]);
  const [bio, setBio] = useState("");

  function submit() {
    if (!name.trim()) return;
    createMe({ name: name.trim().slice(0, 22), emoji, color, mood, bio: bio.trim().slice(0, 140) });
    onDone();
  }

  return (
    <div className="min-h-screen px-5 pt-12 pb-10 max-w-md mx-auto">
      <div className="text-center pop-in">
        <div className="text-6xl anim-sway inline-block" aria-hidden>🌅</div>
        <h1 className="font-display text-4xl font-bold mt-2 text-sunrise leading-tight">CheerUp</h1>
        <p className="text-ink-soft font-semibold mt-1">a gentle place to feel a little less alone.</p>
      </div>

      <div className="card p-6 mt-7 pop-in" style={{ animationDelay: ".08s" }}>
        <p className="font-display font-semibold text-lg">Make an anonymous little you</p>
        <p className="text-ink-soft text-sm mb-4">No emails, no real names. Just a soft corner that's yours.</p>

        <div className="flex items-center gap-3 mb-4">
          <Avatar user={{ emoji, color }} size={64} />
          <div className="flex-1">
            <label className="text-xs font-bold text-ink-soft">YOUR HANDLE</label>
            <div className="flex gap-2">
              <input value={name} onChange={e => setName(e.target.value)} maxLength={22}
                className="w-full rounded-2xl bg-white/80 ring-1 ring-black/5 px-3 py-2 font-bold outline-none" />
              <button onClick={() => setName(handle())} title="shuffle" className="btn-pop rounded-2xl bg-peach px-3 text-lg" aria-label="shuffle name">🎲</button>
            </div>
          </div>
        </div>

        <label className="text-xs font-bold text-ink-soft">PICK A FACE</label>
        <div className="grid grid-cols-8 gap-1.5 mt-1 mb-4">
          {AVATARS.map(a => (
            <button key={a} onClick={() => setEmoji(a)}
              className={`btn-pop aspect-square rounded-xl text-xl grid place-items-center ${emoji===a ? "bg-sun/30 ring-2 ring-sun" : "bg-white/60 ring-1 ring-black/5"}`}>{a}</button>
          ))}
        </div>

        <label className="text-xs font-bold text-ink-soft">PICK A COLOUR</label>
        <div className="flex gap-2 mt-1 mb-4">
          {GRADIENTS.map(g => (
            <button key={g} onClick={() => setColor(g)} aria-label="colour"
              className={`btn-pop w-9 h-9 rounded-full ${color===g ? "ring-3 ring-offset-2 ring-ink/40" : "ring-1 ring-black/10"}`} style={{ background: g }} />
          ))}
        </div>

        <label className="text-xs font-bold text-ink-soft">HOW ARE YOU, REALLY?</label>
        <div className="flex flex-wrap gap-1.5 mt-1 mb-4">
          {MOODS.map(m => (
            <button key={m} onClick={() => setMood(m)}
              className={`btn-pop rounded-full px-3 py-1.5 text-sm font-semibold ${mood===m ? "bg-coral/20 ring-1 ring-coral text-coral" : "bg-white/60 ring-1 ring-black/5 text-ink-soft"}`}>{m}</button>
          ))}
        </div>

        <label className="text-xs font-bold text-ink-soft">A LINE ABOUT YOU <span className="font-normal">(optional)</span></label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={140} rows={2}
          placeholder="Be as soft or as honest as you like…"
          className="w-full mt-1 rounded-2xl bg-white/80 ring-1 ring-black/5 px-3 py-2 outline-none resize-none" />

        <button onClick={submit} className="btn-pop btn-sun w-full font-display font-bold text-lg rounded-2xl py-3.5 mt-4">
          Step into the warmth →
        </button>
      </div>

      <p className="text-center text-ink-soft text-xs mt-5 px-6">
        🛡️ Real people only. New profiles are <b>interview-verified</b> by our team to keep this place safe and kind.
      </p>
    </div>
  );
}
