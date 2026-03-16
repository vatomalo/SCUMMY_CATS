# SCUMMY_CATS

A browser-first point-and-click adventure prototype inspired by SCUMM classics, built for GitHub Pages.

## Current prototype stack

- Phaser 3 (scene/render/input backbone)
- Howler.js (SFX layer)
- GSAP (micro-animations and fades)

> This first drop is a zero-build prototype so it can run directly on GitHub Pages from `index.html`.

## What is implemented

- SCUMM-style verb bar (`Walk to`, `Look at`, `Pick up`, `Use`, `Talk to`)
- Status line feedback
- Inventory strip with item selection
- Interactive room hotspots (cat NPC, shelf, machine)
- A room-art framework with:
  - 7 background layers per room
  - per-layer parallax scroll factors
  - sprite-based props/characters
  - data-driven room layout in `src/roomData.js`
- A simple puzzle flow:
  1. pick up fish from shelf
  2. use fish on machine
  3. machine powers up

## Run locally

Because this uses external CDN assets and module scripts, run with a local HTTP server:

```bash
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Using real sprite art

The room is now defined in `src/roomData.js`.

- Replace any generated texture key with your own loaded PNG using the same texture key.
- Keep the room's `layers` array at 7 entries for the full parallax stack.
- Tune each layer with `scrollFactorX` to control parallax depth.
- Place props and characters in the `sprites` array and match hotspot rectangles to them.

## Next milestones

1. Move to TypeScript + Vite build while preserving GitHub Pages deployment.
2. Swap generated placeholder textures for real PNG sprite layers in `assets/`.
3. Add room transitions and walkable zones.
4. Add dialogue trees and save/load state.
