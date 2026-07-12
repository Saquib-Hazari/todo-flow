# Flow

> A calmer way to organize tasks, protect focus, and make progress every day. ✨

<p align="center">
  <a href="YOUR_LIVE_DEMO_URL">Live Demo</a> ·
  <a href="YOUR_LINKEDIN_URL">LinkedIn</a> ·
  <a href="YOUR_TWITTER_URL">Twitter / X</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TanStack_Start-SSR-FF4154" alt="TanStack Start" />
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black" alt="Firebase Firestore" />
  <img src="https://img.shields.io/badge/Clerk-Authentication-6C47FF" alt="Clerk authentication" />
</p>

## About the project

Flow is a full-stack productivity application designed around a simple idea: fewer distractions, clearer priorities, and a more intentional daily workflow.

It combines a focused todo experience with authentication, persistent cloud storage, responsive navigation, theme switching, filtering, and drag-and-drop organization.

## Preview

<p align="center">
  <img src="./public/homepage.png" alt="Flow landing page" width="48%" />
  <img src="./public/todo.png" alt="Flow dashboard" width="48%" />
</p>

## Highlights

- 🔐 Secure authentication with Clerk.
- ☁️ Persistent, user-scoped todos stored in Cloud Firestore.
- ✅ Create, complete, reorder, delete, and clear todos.
- 🏷️ Filter tasks by Today, Completed, Personal, Work, and Workout.
- 🖱️ Smooth drag-and-drop sorting powered by `dnd-kit`.
- 🌗 Light and dark themes with persisted preferences.
- 📱 Responsive sidebar with a mobile hamburger menu.
- ♿ Accessible controls with semantic HTML, labels, ARIA states, and keyboard-friendly interactions.
- 🚀 Server-side rendering and type-safe server functions with TanStack Start.
- 🧪 Automated tests for greeting and todo-filter edge cases.

## Screens and experience

The application is built around three focused experiences:

1. **Landing page** — explains the product and provides contextual authentication actions.
2. **Authentication** — Clerk-powered sign-in and sign-up flows.
3. **Dashboard** — personalized greeting, progress overview, task filters, persistence, drag-and-drop sorting, and destructive-action safeguards.

## Tech stack

| Layer          | Technology                                                        |
| -------------- | ----------------------------------------------------------------- |
| UI             | React 19, Tailwind CSS                                            |
| Language       | TypeScript with strict checking                                   |
| Framework      | TanStack Start and TanStack Router                                |
| Authentication | Clerk                                                             |
| Database       | Firebase Admin SDK and Cloud Firestore                            |
| Interactions   | Radix UI, `dnd-kit`, Lucide icons                                 |
| Tooling        | Vite, Vitest, Biome                                               |
| Deployment     | Compatible with Netlify, Railway, Vercel, and other Vite runtimes |

## Architecture

```text
React UI
  ├─ TanStack Router routes
  ├─ Accessible reusable components
  ├─ Todo dialog and sortable task list
  └─ Clerk client state

TanStack Start server functions
  ├─ Authentication checks through Clerk middleware
  ├─ User-scoped todo mutations
  └─ Firebase Admin / Firestore persistence
```

Todos are stored per authenticated user:

```text
users/{clerkUserId}/todos/{todoId}
```

## Getting started

### Prerequisites

- Node.js 20+
- A Clerk application
- A Firebase project with Cloud Firestore enabled
- A Firebase Admin service-account credential

### Install

```bash
git clone YOUR_REPOSITORY_URL
cd todo-flow
npm install
```

### Environment variables

Create `.env.local`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Never commit `.env.local` or a Firebase service-account JSON file.

### Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
# Type-check
npx tsc --noEmit

# Run tests
npm run test

# Lint
npm run lint

# Production build
npm run build
```

## Deployment

Flow uses TanStack Start server functions, so deploy it as a full-stack SSR application rather than as a static-only site. Netlify is a strong low-cost option because it has an official TanStack Start integration.

Before deploying:

- Add all server and client environment variables to the hosting provider.
- Use production Clerk keys and configure the production Clerk domain.
- Enable Cloud Firestore for the Firebase project.
- Configure the production domain in Clerk and Firebase.
- Add a real canonical URL and sitemap before public launch.

## Roadmap

- [ ] Edit existing todos.
- [ ] Persist drag-and-drop ordering.
- [ ] Add pagination for larger todo collections.
- [ ] Add optimistic updates and retry states.
- [ ] Add analytics and usage insights.
- [ ] Add end-to-end browser tests.

## Author

Built with care by **Saquib Hazari**.

<p>
  <a href="[YOUR_LINKEDIN_URL](https://www.linkedin.com/in/hazari-saquib/)">LinkedIn</a> ·
  <a href="[YOUR_TWITTER_URL](https://x.com/saquib7298)">Twitter / X</a> ·
  <a href="[YOUR_PORTFOLIO_URL](https://react-frontend-zlql.vercel.app/)">Portfolio</a>
</p>

## License

This project is currently a personal portfolio project. Add a license here if you plan to distribute or open-source it.
