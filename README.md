# 💊 MedSafe — AI Drug Interaction Checker

> **Know before you swallow.**  
> Built for CodeCure AI Hackathon — SPIRIT'26, IIT BHU

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-E07A5F?style=for-the-badge)](https://YOUR_USERNAME.github.io/medsafe)
[![Made With](https://img.shields.io/badge/Made%20With-HTML%20CSS%20JS-3D9E8C?style=for-the-badge)](#)
[![API](https://img.shields.io/badge/Powered%20By-Gemini%20AI%20%2B%20NIH%20RxNorm-C9566B?style=for-the-badge)](#)

---

## 🧠 What is MedSafe?

MedSafe is an AI-powered drug interaction checker that helps patients and caregivers instantly identify dangerous medication combinations — explained in plain language, not medical jargon.

Drug interactions are responsible for **over 125,000 deaths per year** in the US alone. Most patients taking multiple medications have no idea if their drugs are clashing. MedSafe solves this.

---

## ✨ Features

- ⚡ **Interaction Checker** — Add 2+ medications and get an instant AI-generated interaction report with severity levels (MAJOR / MODERATE / MINOR)
- 🔍 **Drug Lookup** — Search any medication by brand name (Crocin, Dolo 650, Brufen, Combiflam, etc.) and get plain-English info on what it does, side effects, and warnings
- 💊 **Drug Info Cards** — Tap any medication pill to see full FDA label data in a modal
- 🌐 **Brand Name Support** — Resolves Indian brand names to generic names automatically (e.g. Crocin → Paracetamol)
- 🔑 **Secure API Key Input** — Your Gemini key stays in your browser only, never stored or sent anywhere except Google's API

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| AI | Google Gemini 2.5 Flash Lite (via Gemini API) |
| Drug Interactions | NIH RxNorm Interaction API (free, no key needed) |
| Drug Info & Labels | openFDA Drug Label API (free, no key needed) |
| Hosting | GitHub Pages |

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/medsafe.git
cd medsafe
```

### 2. Get a free Gemini API key
Go to [aistudio.google.com](https://aistudio.google.com/app/apikey) and create a free API key. Takes 30 seconds.

### 3. Open `index.html` in your browser
No build step, no npm install, no server needed. Just open the file.

### 4. Enter your API key in the popup
Paste your Gemini key when prompted. Done!

---

## 📁 Project Structure

```
medsafe/
├── index.html      # App structure and layout
├── style.css       # All styling — warm gradient mesh aesthetic
└── app.js          # All logic — API calls, drug lookup, interaction checker
```

---

## 🔌 APIs Used

| API | Purpose | Auth Required |
|---|---|---|
| [NIH RxNorm](https://rxnav.nlm.nih.gov/) | Drug interaction data from real FDA/NIH database | ❌ None |
| [openFDA](https://open.fda.gov/apis/drug/label/) | Drug labels — uses, side effects, warnings | ❌ None |
| [Google Gemini](https://ai.google.dev/) | Plain-English explanations of interactions | ✅ Free API key |

---

## 💡 How It Works

```
User adds drugs
      ↓
RxNorm API → fetches RxCUI codes for each drug
      ↓
RxNorm Interaction API → checks all drug pairs
      ↓
openFDA API → fetches drug label info (uses, side effects, warnings)
      ↓
Gemini AI → explains everything in plain English
      ↓
Renders interaction report with severity levels
```

---

## 🏥 Why This Matters

- Patients in India often self-medicate with OTC drugs without knowing interactions
- Elderly patients commonly take 5–10 medications simultaneously
- Doctors have limited consultation time to explain every possible interaction
- Most existing tools show raw medical data — not understandable by non-doctors

MedSafe bridges this gap with real FDA data + AI explanation.

---

## 🎨 Design

Warm gradient mesh aesthetic inspired by modern AI product design — glassmorphism cards, floating blobs, Playfair Display serif headings, smooth animations. Built to look professional enough to demo to judges.

---

## ⚠️ Disclaimer

MedSafe provides general information only and does not constitute medical advice. Always consult a licensed healthcare professional before making any medication decisions.

---

## 👨‍💻 Built By : **Himanshu Kundal**  


---

## 📄 License

MIT License — free to use, modify, and distribute.
