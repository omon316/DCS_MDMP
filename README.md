# DCS Mission Planning Tool

This repository contains a web-based tool for planning missions in Digital Combat Simulator (DCS). The page is composed entirely of HTML and JavaScript and runs locally in a browser. Floating windows let you manage briefs such as threats, situation, mission, flight plans and more.

## Opening `index.html`

1. Launch a modern web browser.
2. Open the file `index.html` from this repository (double click it or start a small HTTP server such as `python3 -m http.server` and browse to `http://localhost:8000/index.html`).

The interface will appear with a top bar, a panel with window buttons and a background video.

## Editor mode

- Click the **Editor Mode** button located in the lower left corner to toggle editing capabilities.
- When enabled, input fields and content areas become editable and drop zones appear so you can drag images or tables into the different floating windows.

## Saving and loading

- Use the **Save** button in the top bar to download the current state as `dcs-plan.json`.
- Use the **Load** button to select a previously saved JSON file and restore that state.

## Background videos

Two background videos are included:

- `video.mp4` – a small demo clip (~1.5&nbsp;MB) referenced in the older `index1.html`.
- `video3.mp4` – a longer, higher quality version (~12&nbsp;MB) used by `index.html`.

Both files loop automatically, but `index.html` defaults to `video3.mp4` while `index1.html` keeps the lightweight `video.mp4`.
