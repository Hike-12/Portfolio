## Portfolio Website

A professional portfolio web application built with **Next.js 16** and **React 19** to showcase projects, technical skills, experience, and contact details.

The frontend application is located in:

`/tmp/workspace/Hike-12/Portfolio/portfolio`

## Highlights

- Modern, responsive single-page portfolio experience
- Sectioned layout: Hero, About, Skills, Projects, Experience, and Contact
- Animated UI using Framer Motion and Three.js integrations
- Theme support and polished interactive components
- Contact form API endpoint with email delivery via Nodemailer
- SEO-focused routes including `robots.js` and `sitemap.js`

## Tech Stack

- **Framework:** Next.js 16
- **UI:** React 19
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion, GSAP, Anime.js
- **3D:** Three.js, @react-three/fiber, @react-three/drei
- **Email/API:** Nodemailer + Next.js Route Handlers

## Project Structure

```text
Portfolio/
├── README.md
└── portfolio/
    ├── package.json
    ├── public/
    └── src/
        └── app/
            ├── components/
            ├── api/contact/route.js
            ├── page.js
            ├── layout.js
            ├── robots.js
            └── sitemap.js
```

## Getting Started

### 1) Install dependencies

```bash
cd /tmp/workspace/Hike-12/Portfolio/portfolio
npm ci
```

### 2) Start the development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

For contact form email delivery, create a `.env.local` file in `/tmp/workspace/Hike-12/Portfolio/portfolio`:

```bash
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

If these are not configured, the UI includes a fallback flow that opens the user’s email client.

## Scripts

Run these commands from `/tmp/workspace/Hike-12/Portfolio/portfolio`:

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run lint checks

## Deployment

This project can be deployed on platforms that support Next.js (for example, Vercel).  
Make sure required environment variables are configured in the deployment environment.
