# Better Homepage

A sleek, hyper-minimalist Firefox & Chrome custom new tab replacement focused on keyboard efficiency, search intelligence, power-user shortcuts, and a dark glassmorphism UI — powered by **SolidJS** for ultra-fast startup and near-zero memory footprint.


![SolidJS](https://img.shields.io/badge/SolidJS-1.9-2c4f7c?logo=solid&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-06B6D4?logo=tailwindcss&logoColor=white)
![Firefox](https://img.shields.io/badge/Firefox-Supported-FF7139?logo=firefoxbrowser&logoColor=white)

![Better Homepage](https://img.shields.io/badge/Better_Homepage-Keyboard_First-8B5CF6)
![New Tab](https://img.shields.io/badge/New_Tab-Reimagined-18181B)


## Key Features

* **Instant Startup (<5ms Cold Start):** Migrated from React 19 to SolidJS, eliminating the Virtual DOM overhead and reducing the JS bundle size by >72% (from 251 kB down to ~69 kB uncompressed / 21 kB gzip).
* **Zero Theme Flash (FOUC-Free):** Synchronous theme evaluation prevents dark/light theme flashing on new tab launch.
* **Unified Search Brain:** Differentiates between search queries, raw URLs (including `localhost:PORT`, IPv4 addresses, and domain paths), math calculations, and prefix shortcuts.
* **Instant Engine Switching:** Seamlessly switch between search providers (DuckDuckGo, Google, Brave, Bing, YouTube, GitHub, Reddit, Wikipedia, and AI search tools).
* **Keyboard-First Shortcuts & Autofocus:** Automatic input autofocus on tab launch. Execute quick navigation commands straight from the search box using intuitive prefixes (`yt`, `gh`, `r`, `npm`, `maps`, `calc`, `docs`, `drive`, etc.).
* **Advanced Google Dorks Accordion:** One-click insertion of search operators for targeted query building (e.g., `filetype:pdf`, `site:`, `inurl:`).
* **Scrollbar-Free Liquid Glass UI:** Modern dark glassmorphism layout with hardware-accelerated animations and hidden scrollbars.


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

* **UI Library:** SolidJS (Fine-grained reactive signals, 0 Virtual DOM)
* **Build Tool:** Vite + `vite-plugin-solid`
* **Styling:** Tailwind CSS v4 + Liquid Glass Theme Tokens
* **Icons:** Zero-dependency compiled Solid SVG components
* **Architecture:** Modularized state, custom hooks (`useSearchEngine`), and search intelligence brain (`searchBrain.js`)


## Development Setup

### 1. Clone & Install

```bash
git clone https://github.com/user/betterHomepage.git
cd betterHomepage
bun install # or npm install
```

### 2. Run Development Server

```bash
bun run dev # or npm run dev
```

### 3. Build for Web Extension

```bash
bun run build # or npm run build
```


## Loading into Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**.
3. Select the `manifest.json` file inside the build output folder (`extension/manifest.json`).
