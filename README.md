<div align="center">

# ☀️ CheerUp

**A gentle place to feel a little less alone.**

Receive anonymous kind words and tiny virtual treats. Built for anyone having a hard day.

</div>

---

CheerUp is a small, mobile-first web app that lets people send each other **anonymous, positive messages** and **virtual treats** (a Sweet, a Treat, a Coffee, a Milo 🥤) to brighten someone's day. It's designed to feel warm, safe, and soft — because the people it's for are often sad or insecure.

## ✨ Features

- **📱 Mobile-first** — designed for handphones on basic Wi-Fi: big readable type, chunky tap targets, light bundle.
- **🙈 Anonymous profiles** — no email, no real name. Pick a handle, a face, a colour, and a mood. Stored locally.
- **🛡️ Interview / Verification shield** — profiles show **"Verified via Interview"** or **"Pending interview."** A mock **Admin Interview Panel** (Shield tab, demo passcode `kind`) lets trust-&-safety verify real humans and keep scammers out.
- **💌 Kindness-only messaging** — a live filter blocks unkind words and shouting *before* a message can be sent, and offers gentle starter lines. Only warmth gets through.
- **🎁 Send a Treat** — tap to send a Sweet / Treat / Coffee / Milo. Each one celebrates with confetti and adds to the recipient's treat count.

## 🧩 Tech stack

- **Vite + React + TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **canvas-confetti** for the joy bursts
- **localStorage** as a zero-config mock database — works fully offline, out of the box. A small seed community loads on first run.

No backend, no accounts, no setup. Just open it.

## 🚀 Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the built app
```

## 🎨 Design

A custom **"Sunrise Comfort"** system — warm cream/peach gradient skies, sunshine + coral accents, sage for verified, rounded pillowy cards, **Fredoka + Nunito** type, and gentle float/confetti motion. Calm and reassuring by intent.

## 🗂️ Structure

```
src/
  lib/store.ts      localStorage data layer + seed community
  lib/kindness.ts   the kindness-only word filter
  components/       Onboarding · Feed · Profile · Inbox · Admin · ui
  App.tsx           shell + mobile bottom nav
```

## 💛 A note

This is a kindness prototype. The word filter is a friendly front-end shield, not a substitute for real moderation or crisis support. If you or someone you know is struggling, please reach out to a real person or a local helpline.

---

<div align="center"><sub>Made with warmth · be kind to someone today 🌻</sub></div>
