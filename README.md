# Portfolio Admin

Content console for the portfolio site. It authenticates the single seeded
administrator and (as editors are added) manages the profile, social links,
professional and technical skills, project groups, and projects through the
portfolio API.

This app includes authentication, the protected shell, the MUI theme, React
Query, the server-only Axios layer, and the editors for every portfolio content
module.

## Stack

- Next.js 16 (App Router, `proxy.ts`)
- React 19 and MUI 7
- TanStack Query 5
- Axios and Zod 4
- TypeScript strict mode

## Setup

Requires Node.js 22 or newer and npm.

```bash
npm install
cp .env.example .env
# set ADMIN_BACKEND_URL in .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to
`/dashboard`, which requires a session.

## Environment

| Variable | Required | Notes |
| --- | --- | --- |
| `ADMIN_BACKEND_URL` | Yes | Backend origin, for example `http://localhost:5000`. Server-only. No trailing slash. |

`ADMIN_BACKEND_URL` is read only on the server. The access token is stored in an
httpOnly cookie and is never exposed to browser JavaScript, URLs, or
`NEXT_PUBLIC_*` variables.

## Routes

| Path | Access | Purpose |
| --- | --- | --- |
| `/login` | Public | Administrator sign-in. Authenticated admins are sent to `/dashboard`. |
| `/dashboard` | Admin | Protected overview with content counts and quick actions. |
| `/profile` | Admin | Edit the public profile (name, date of birth, country, bio). |
| `/socials` | Admin | Add, edit, and delete social links. |
| `/skills` | Admin | Manage professional and technical skills in tabs. |
| `/project-groups` | Admin | Create, rename, and delete project groups. |
| `/projects` | Admin | Manage projects grouped by section, including image uploads. |

## API coverage

Every endpoint in `ADMIN_API_CONTRACTS.md` is consumed:

- Auth: `POST /api/auth/login`, `POST /api/auth/verify`
- Profile: `GET`/`PATCH /me`
- Social links: `GET`/`POST /me/socials`, `PATCH`/`DELETE /me/socials/<id>`
- Professional and technical skills: `GET`/`POST /me/{professional,technical}-skills`, `PATCH`/`DELETE /me/{professional,technical}-skills/<id>`
- Project groups: `GET`/`POST /api/project-groups`, `PATCH`/`DELETE /api/project-groups/<id>`
- Projects: `GET`/`POST /api/projects/`, `PATCH`/`DELETE /api/projects/<id>`

Public reads omit the bearer token; writes attach it. Project images are sent as
`multipart/form-data`; `PATCH` without a new image uses JSON.

## Authentication

The portfolio backend contract has **no refresh endpoint and no registration
endpoint**, so the app behaves accordingly:

- Login calls `POST /api/auth/login` from a Server Action and stores
  `access_token` plus the returned admin identity in httpOnly,
  `sameSite=strict` cookies (`secure` in production).
- The token cookie lifetime follows the JWT `exp` when readable, otherwise two
  hours.
- Session restore calls `POST /api/auth/verify` with the bearer token, then
  reads the cached admin identity from its cookie.
- The proxy reads `exp` to avoid sending an obviously dead token. Signature
  validation remains the backend's job.
- When the token expires the admin signs in again. There is no silent refresh.
- Logout clears both cookies locally; the contract exposes no logout endpoint.

The only account is the seeded `Admin` account.

## Architecture

```text
Client component
   └─ React Query queryFn / mutationFn
        └─ Server Action            src/app/actions/<feature>-actions.ts
             └─ API module          src/api/<feature>/server-side.ts
                  └─ getServerAxios()   src/api/server-axios.ts
                       └─ Backend       baseURL = ADMIN_BACKEND_URL
```

Client components never perform HTTP and never import the server-only API
modules. The contract's error shapes are normalized in
`src/api/utils/server-error.ts`:

- validation: `{ "errors": { "field": ["Message"] } }`
- other failures: `{ "error": "Message" }`

## Project structure

```text
src/
  app/            Routes, layouts, Server Actions, providers, theme
  api/            Server-only API modules, auth, shared error/cookie helpers
  components/     Shared presentational components
  config/         Environment and auth configuration
  contexts/       Auth session context
  layout/         Auth shell and protected dashboard shell
  proxy/          Route protection
  routes/         Known path constants
  utils/          Display, formatting, and validation helpers
  views/          Feature screens
```

## Scripts

```bash
npm run dev          # development server
npm run build        # production build
npm run start        # serve the production build
npm run lint         # ESLint
npx tsc --noEmit     # TypeScript check
npm test             # Vitest run
npm run test:watch   # Vitest watch mode
```
# Portfolio-Management-Board
