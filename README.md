# 🖍️ Crayon Portfolio — MERN

A playful, heavily animated "design-canvas" portfolio with a full admin panel.

**Stack:** MongoDB · Express · React 18 (Vite) · Tailwind CSS · Framer Motion · Lenis smooth scroll

## What's inside

**Public site (`/`)**
- Ink-reveal preloader with a self-drawing crayon scribble
- Custom cursor that grows and shows labels ("visit ↗", "drag", "send")
- Figma-style floating toolbar nav with a sliding active pill (full-screen circle-reveal menu on mobile)
- Hero: giant name with spring-in letters that jump & change colour on hover, a Figma selection frame, fake "multiplayer" cursors (Recruiter / Client / You?), mouse-parallax blobs, and **draggable stickers** (photo polaroid, spinning "open to work" stamp, location tag, sticky note, emojis)
- Crossing tape marquees that tilt as you scroll
- About: word-by-word bio reveal + floating parallax sticky-note stats
- Skills drawn as **crayons** (length = skill level), which visitors can toss around
- **Projects** (fully dynamic): 3D tilt cards with light glare, washi tape, rolling "visit" badge, tag filters with animated layout. **Clicking a card opens the project's live link**; the GitHub button opens the source. No image? Each project gets unique generated doodle art.
- Experience timeline whose line draws as you scroll
- Contact form → saved to MongoDB (rate-limited, bot honeypot)
- Footer with your name in giant outline letters that bounce on hover, plus a live clock

**Admin panel (`/admin`)**
- JWT login
- Dashboard with counts
- **Projects:** add / edit / delete, upload a cover image or paste a URL, live link, GitHub link, tags, accent colour, date, featured (wide card), publish/hide, reorder ↑↓
- **Profile & content:** name, role, headline, location, avatar, availability, bio, stats, fun facts, marquee words, skills (emoji + level), tools, email, resume (PDF), social links
- Experience timeline editor
- Messages inbox (read/unread, reply via email, delete)
- Account: change admin email/password

## Run it locally

Requirements: **Node 18+** and **MongoDB** (local install, or a free MongoDB Atlas cluster).

```bash
# 1. install everything
npm run install:all

# 2. configure the API
cp server/.env.example server/.env
#    → set MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD

# 3. (optional) load demo content
npm run seed

# 4. start API (:5000) + site (:5173)
npm run dev
```

Open http://localhost:5173 for the site and http://localhost:5173/admin to log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
The admin account is created automatically the first time the server starts. **Change the password** under Account afterwards.

Then go to **Admin → Profile & content** and replace the placeholder name, bio, links, etc. with yours, and **Admin → Projects** to add your real projects.

## Deploy (single server, e.g. Render / Railway / a VPS)

```bash
npm run install:all
npm run build      # builds client/dist
npm start          # Express serves the API + the built site on PORT
```

Set the same environment variables as `server/.env` on your host. Uploaded images are stored in `server/uploads/`. On hosts with a temporary filesystem (Render free tier, etc.) uploads disappear on redeploy, so paste image URLs (e.g. from Cloudinary/ImgBB) instead, or attach a persistent disk.

**Split deploy** (frontend on Vercel/Netlify, API elsewhere): build the client with `VITE_API_URL=https://your-api.com` and set `CLIENT_URL=https://your-site.com` on the API. Add a SPA rewrite (all routes → `/index.html`) on the frontend host.

## Project structure

```
server/
  src/index.js            Express app, static uploads, serves client build
  src/models/             User, Profile, Project, Experience, Message
  src/routes/             auth, profile, crud (projects & experience), messages, upload
  src/seed.js             demo content
client/
  src/pages/Home.jsx      public site
  src/components/         Hero, Projects, ProjectCard, Skills, … (all animations)
  src/pages/admin/        admin panel
```

## API quick reference

| Method | Route | Auth |
|---|---|---|
| POST | /api/auth/login | – |
| GET | /api/profile | – |
| PUT | /api/profile | ✔ |
| GET | /api/projects (published) | – |
| GET | /api/projects/all | ✔ |
| POST / PUT / DELETE | /api/projects[/:id] | ✔ |
| PUT | /api/projects/reorder `{ids:[]}` | ✔ |
| (same pattern) | /api/experience | |
| POST | /api/messages | – |
| GET / PATCH / DELETE | /api/messages[/:id] | ✔ |
| POST | /api/upload (multipart `file`) | ✔ |
