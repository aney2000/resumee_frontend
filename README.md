# Portfolio

## The idea

A portfolio whose first impression is something you can play with. Visitors land on a 3D conference badge hanging from a lanyard: they can grab it, swing it, flip it to read the back, or snip the lanyard with a pair of scissors and watch a fresh badge drop in. Below it, the CV becomes a 3D journey through your milestones, followed by classic sections for experience, education, projects, courses and skills. Everything is driven by a single data file.

## Using the website

**The badge**

- Drag the badge to swing it on its lanyard; click it to see the back.
- **✂ Cut** sends a pair of scissors to snip the lanyard: the badge falls out of view and a new one drops in.
- **↺ Reset** hangs a fresh badge, handy if it ever tangles into an odd position.
- Keyboard users can Tab to a _Flip badge_ button and to both controls.

**The 3D CV**

- Click a milestone or use the arrow buttons (or the arrow keys) to travel along the path; the panel shows the details.
- Toggle the chips to filter experience, education, projects and courses.

**Navigation:** the top bar jumps to each section.

Without WebGL, the badge and the 3D CV are replaced by accessible 2D versions.

## Run it

### Docker

```bash
npm run docker:up    # production image (nginx) on http://localhost:8080
npm run docker:dev   # Vite dev server with hot reload on http://localhost:5173
```

Equivalent raw commands: `docker compose up --build web` and `docker compose --profile dev up --build dev`.
The image build runs every check (typecheck, lint, format, tests); a failing check aborts the build.

### Node (18+)

```bash
npm ci
npm run dev          # http://localhost:5173
npm run build && npm run preview
```

### Windows with Node in WSL

Run the commands inside WSL and open the URL in your Windows browser:

```bash
cd /mnt/c/path/to/Frontend
npm ci
CHOKIDAR_USEPOLLING=true npm run dev -- --host   # http://localhost:5173
```

`CHOKIDAR_USEPOLLING=true` is needed when the project lives on the Windows drive (`/mnt/c/...`): WSL receives no file-change events from it, so without polling edits are not picked up until the server restarts.

## Troubleshooting: I only see the 2D version

The 3D badge and the 3D CV are replaced by their 2D fallbacks only when the browser reports **no WebGL**. The OS "reduced motion" preference does not switch to 2D.

1. **WebGL unavailable.** Check `chrome://gpu` (or `edge://gpu`) for "WebGL: Hardware accelerated" and enable _Use graphics acceleration when available_ in the browser settings. Remote Desktop sessions, VMs and some corporate GPU policies may disable it.
2. **Quick check** in the DevTools console:

   ```js
   !!document.createElement('canvas').getContext('webgl2'); // must be true
   ```

With WebGL available, the hero shows the lanyard (_Drag me - click to flip_) and the 3D CV section renders a canvas.

## Make it yours

1. Edit **`src/data/profile.data.ts`** - it is the only file you need to change. Dates use `YYYY-MM`; omit `end` for ongoing items; every `id` must be unique.
2. Put your photo at **`public/photo.jpg`** and set `photoUrl: '/photo.jpg'`. Until then the placeholder `public/photo.svg` is used.
3. Run `npm test` - `src/data/profile.data.test.ts` validates the file and catches bad dates or duplicate ids.
