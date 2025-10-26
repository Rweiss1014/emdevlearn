
DevLearn Landing Page + Mini-Game
=================================

How to run
----------
1) Serve the folder with any static server:
   - Python: `python3 -m http.server 8080` then open http://localhost:8080
   - Node: `npx http-server . -p 8080`
2) Open /index.html

What to edit
------------
- index.html: copy and content
- styles.css: design tokens and layout
- /game/pod.json: game content and settings
- /game/pod.js: game logic and analytics hooks

Analytics
---------
Listen for window "pod_event" CustomEvent or use Plausible:
window.addEventListener("pod_event", e => console.log(e.detail));
