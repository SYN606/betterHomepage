# Better Homepage

A sleek, hyper-minimalist Firefox & Chrome custom new tab replacement focused on keyboard efficiency, search intelligence, power-user shortcuts, and a dark glassmorphism UI.


![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-06B6D4?logo=tailwindcss&logoColor=white)
![Firefox](https://img.shields.io/badge/Firefox-Supported-FF7139?logo=firefoxbrowser&logoColor=white)
![Chrome](https://img.shields.io/badge/Chrome-Supported-4285F4?logo=googlechrome&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green)


## Key Features

* **Unified Search Brain:** Automatically differentiates between search queries, raw URLs (including `localhost:PORT`, IPv4 addresses, and domain paths), math calculations, and prefix shortcuts.
* **Instant Engine Switching:** Seamlessly switch between search providers (DuckDuckGo, Google, Brave, Bing, YouTube, GitHub, Reddit, Wikipedia, and AI search tools).
* **Keyboard-First Shortcuts:** Execute quick navigation commands straight from the search box using intuitive prefixes (`yt`, `gh`, `r`, `npm`, `maps`, `calc`, `docs`, `drive`, etc.).
* **Advanced Google Dorks Accordion:** One-click insertion of search operators for targeted query building (e.g., `filetype:pdf`, `site:`, `inurl:`).
* **Scrollbar-Free Glass UI:** Modern dark glassmorphism layout with hidden scrollbars for a distraction-free typing experience.


## Quick Command Shortcuts

| Prefix | Target Destination | Example Query |
| --- | --- | --- |
| `yt` | YouTube Search | `yt react tutorial` |
| `gh` | GitHub Search | `gh react` |
| `wiki` | Wikipedia Search | `wiki linux` |
| `map` / `maps` | Google Maps | `map delhi` |
| `r` / `reddit` | Reddit Search | `r webdev` |
| `calc` | Math Evaluation | `calc 22*7` |
| `npm` | NPM Package Search | `npm express` |
| `gm` / `mail` | Gmail Inbox | `gm inbox` |


## Tech Stack

* **UI Library:** React 18 + Vite
* **Styling:** Tailwind CSS + Glassmorphism Variables
* **Icons:** `react-icons` (Simple Icons + Feather Icons)
* **Architecture:** Barrel Exports (`src/features/index.js`) for modularized state, hooks, and search configuration logic



## Development Setup

### 1. Clone & Install

```bash
git clone https://github.com/user/betterHomepage.git
cd betterHomepage
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Build for Web Extension

```bash
npm run build
```


## Loading into Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**.
3. Select the `manifest.json` file inside your build output folder (`dist`).

