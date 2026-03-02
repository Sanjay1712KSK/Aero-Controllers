# Aero-Controllers: Live Interactive Documentation

A macOS-style interactive documentation frontend for the GPS-denied drone stabilization and autonomy project.

## Overview

This repository contains the frontend application for presenting:
- Project story and context
- Control and stability framework
- System architecture
- Simulation phases (Phase 1 to Phase 4)
- Team and inspiration sections

The UI is built as a desktop-like experience with a floating window shell, top menu bar, dock navigation, and simulation phase switching.

## Frontend Live Interactive Documentation - Tech Stack

- **Framework:** Next.js `16.1.6` (App Router, `app/` directory)
- **UI Library:** React `19.2.3` + React DOM `19.2.3`
- **Language:** JavaScript / JSX (no TypeScript)
- **3D/Graphics:** Three.js `0.183.1`, `@react-three/fiber`, `@react-three/drei`
- **Animation:** GSAP `3.14.2` (+ ScrollTrigger usage)
- **Icons:** `lucide-react`
- **Styling:** Global CSS + Tailwind CSS v4 setup (`tailwindcss`, `@tailwindcss/postcss`)
- **Linting:** ESLint 9 + `eslint-config-next`
- **Build/Deploy mode:** `output: 'export'` (static export), with `basePath: '/Aero-Controllers'` and unoptimized Next images.

## Project Structure

```text
app/
  about-us/
  architecture/
  components/
  documentation/
  how-to-use/
  simulation/
    phase-2/
    phase-3/
    phase-4/
  technical/
  globals.css
  layout.js
  page.js
public/
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open:
- `http://localhost:3000/Aero-Controllers`

## Available Scripts

```bash
npm run dev    # start local development server
npm run build  # create production build
npm run start  # run production server
npm run lint   # run ESLint
```

## Build and Static Export Notes

The app is configured for static export in `next.config.mjs`:
- `output: 'export'`
- `basePath: '/Aero-Controllers'`
- `images.unoptimized: true`

When referencing static assets, include the configured base path where required.

## Key UI Modules

- **Mac Desktop Shell:** Menu bar, floating window, dock, credits
- **How To Use:** Apple documentation style instructional page
- **About Us:** Cinematic hero, team cards, inspiration section, closing note
- **Simulation:** Multi-phase documentation views with charts/media and phase routing

## License

This project is currently private/internal unless specified otherwise by the repository owner.
