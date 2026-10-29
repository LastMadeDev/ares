# Project ARES website

The landing page for Project ARES, served by GitHub Pages at https://lastmadedev.github.io/ares/.

Static HTML, CSS and JavaScript. No build step: edit and push to `main`.

| File | What it holds |
|---|---|
| `index.html` | All page copy and sections. |
| `styles.css` | Brand tokens (from the kit's `docs/brand/README.md`) and layout. |
| `main.js` | Launch-mode links, the hero terminal run, the skills explorer, the command palette and the background field. |
| `assets/` | Brand art copied from the kit, plus `ares-mark.svg`, a hand trace of the logo. |

## Launch mode

`<html data-mode="...">` at the top of `index.html` switches every call to action:

- `early-access` (current): the kit repository is private, and buttons open the access request form in this repository's issues.
- `open-source`: buttons point at the quick start and the kit repository.

The links for each mode live in the `LINKS` table at the top of `main.js`.

## Preview locally

Open `index.html` in a browser, or run `python -m http.server` in this folder and visit http://localhost:8000.

This is not sponsored, endorsed, or administered by Epic Games, Inc.
