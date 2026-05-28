# 🏡 HomeFit — Family Health Tracker

Track each family member's **calories, water, weight, meal prep, workouts, and daily
motivation** — with targets tuned to each person's **age** (kids get growth-based
calorie estimates, not weight-loss deficits). Built for **Indian families** with
veg / non-veg meal plans and an Indian food database.

A React **PWA** (installable, works offline). **All data is stored locally in your
browser** — no accounts, no backend. Great for a shared family device.

## Features

| Feature | What it does |
| --- | --- |
| 👪 **Family leaderboard** | The default "Family" view ranks everyone's day by a wellness score (hydration + meals logged near target + weighed in). Tap a name to open their tracker. |
| 👨‍👩‍👧 **Members** | Add each family member (age, sex, height, weight, activity, goal, **veg/non-veg**). Switch with the chips up top; double-click a chip to edit. |
| 🍎 **Calories** | Searchable food database led by **Kerala dishes** (appam, puttu, idiyappam, kappa, fish curry, thoran…) plus common items, with one-tap logging and veg/non-veg dots — or add a custom item. Logged vs an **age-based target** (adults: Mifflin-St Jeor BMR; kids: growth estimates). |
| 💧 **Water** | One-tap drink logging vs an age/weight-based hydration goal. |
| ⚖️ **Weight** | Log weight over time, see the trend chart with your goal line and total change, plus a **goal projection** — a dashed line + "at this rate you'll hit X kg around <date>" based on a linear fit of your trend. |
| 🍽️ **Meal Prep** | A weekly **Kerala** plan (appam & stew, puttu & kadala, fish/chicken curry, sadya, pazham pori…) matched to the member's goal, filtered to **veg or non-veg**, with **portion sizes scaled age-wise** so each day's calories land near that member's age-based target. |
| 🏃 **Workouts** | Embedded daily workout videos picked by age group (YouTube search fallback). Tap **"＋ Did this"** to log a specific workout (with its minutes), or **"Log other activity"** for anything else — building a workout streak and daily active-minutes. |
| 📅 **History** | A per-member month **calendar** — dots mark meals/hydration/workout/weigh-ins each day; tap any past day for its detail. Includes a **weekly averages chart** (calorie bars + water line vs targets) and a **weekly active-minutes chart**. |
| 💾 **Backup & restore** | Export all data to a JSON file (from the Family view) and import it on another device/browser. |
| 🔥 **Streaks** | The leaderboard shows each member's run of consecutive "healthy days" (meal + hydrated) **and** their 🏃 workout streak. Completing a workout also boosts the daily score. |
| 💬 **Motivation** | A quote of the day, plus **scheduled daily reminders** at a time you pick (tap 🔕 Reminders). |
| 📲 **Installable PWA** | Add to your phone's home screen, works offline. Where the browser supports it (Chromium), reminders fire even when the app is closed; otherwise while it's open/installed. |

## Run it

```bash
npm install
npm run dev      # open http://localhost:5173
```

Build for hosting anywhere static:

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build
```

## Project layout

```
public/
  manifest.webmanifest # PWA manifest
  sw.js                # service worker (offline cache + notifications)
  icon-*.png           # app icons (generated from icon.svg)
src/
  App.jsx              # shell: family view, members, tabs, quote, reminders
  reminders.js         # daily reminder scheduling (TimestampTrigger + fallback)
  store/useStore.js    # localStorage persistence + actions
  data/
    nutrition.js       # age-based calorie & water target math
    foods.js           # food database led by Kerala dishes (search, veg/non-veg)
    mealPlans.js       # Kerala meal ideas by goal/diet + portion scaling + plan builder
    workouts.js        # workout videos by age group + workout-day/minutes helpers
    projection.js      # linear-fit weight-goal projection
    quotes.js          # quote-of-the-day
  components/          # Dashboard, Trackers, WeightChart, MealPrep, Workouts,
                       # MemberForm, Leaderboard, History, WeeklyAverages, DataBackup
```

> **Note:** the service worker only registers in production builds. In dev it is
> intentionally skipped (and any existing one unregistered) because caching Vite's
> dev module graph causes stale-module / "two copies of React" errors.

## ⚠️ Disclaimer

HomeFit gives **general estimates** based on public dietary guidelines, **not medical
advice**. Calorie and water targets — especially for children — should be confirmed
with a doctor or registered dietitian.
