# CHADI International

Website and management platform for CHADI International: a public marketing
site plus an admin dashboard for managing projects, events, team members,
gallery photos, partners, stories and incoming form submissions.

## Project structure

```
client/   React + Vite + Tailwind frontend (public site + admin dashboard)
server/   Express API (auth, CMS content, form submissions)
```

## Getting started

From the repo root:

```bash
npm --prefix client install
npm --prefix server install

npm run dev:api      # starts the API on http://127.0.0.1:4000
npm run dev:client   # starts the site on http://127.0.0.1:5173
```

Build the client for production with `npm run build`, lint it with `npm run lint`.

## Environment variables (server)

None are required to run locally - sensible defaults are used - but you
should set these before deploying anywhere real:

| Variable         | Purpose                                              | Default (dev only)          |
| ---------------- | ----------------------------------------------------- | ---------------------------- |
| `AUTH_SECRET`    | Signs admin session tokens                             | insecure built-in fallback   |
| `ADMIN_EMAIL`    | Seeds the first admin account (only used once)         | `admin@chadi-international.org` |
| `ADMIN_PASSWORD` | Seeds the first admin account's password (only used once) | `ChadiAdmin!2026`         |
| `PORT`           | API port                                               | `4000`                        |
| `PAYSTACK_SECRET_KEY` | Verifies donations made through the Donate page (server-side only, never exposed to the browser) | none - payments return a clear error until set |

The client reads `VITE_API_URL` if you need to point it at a non-default API
URL (e.g. in production); it falls back to `http://127.0.0.1:4000/api`. It
also reads `VITE_PAYSTACK_PUBLIC_KEY` for the Paystack checkout popup - set
this in `client/.env` (create the file if it doesn't exist):

```
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxx
```

Get both keys from your Paystack dashboard under Settings → API Keys & Webhooks.
Use the `pk_test_...` / `sk_test_...` pair while developing, and switch to the
live pair only once you're ready to accept real payments. Without a secret key
set, the Donate page still works - it just shows a friendly notice on the
payment form and falls back to the "Other Ways to Give" interest form.

## Admin dashboard

Visit `/admin/login` on the running site. The first time the server starts,
it seeds one admin account using `ADMIN_EMAIL` / `ADMIN_PASSWORD` (or the
defaults above if those aren't set). **Change this password after your first
login** - go to Admin Users in the dashboard sidebar.

From the dashboard you can manage:

- **Projects, Events, Team, Gallery, Partners, Stories** - full create/edit/delete,
  and changes appear on the public site immediately (no rebuild needed).
- **Messages, Volunteers, Donations** - view and manage submissions from the
  public Contact, Volunteer and Donate forms. Donations includes both real
  Paystack payments (verified server-side) and "other ways to give" interest
  submissions, shown together with a Type column.
- **Admin Users** - add or remove who can log in to the dashboard.
- **Settings** - the four homepage stat counters, contact email, focus
  region, office hours and social links.

**Programs and News are intentionally not CMS-managed** - they stay as static
content in `client/src/data/`. Ask if you'd like those made editable too.

### Password reset

No email provider is configured, so "Forgot password" doesn't actually send
an email - it logs the reset link to the API server's console (and returns
it directly in the response outside production) so you can test the flow.
Wire up a real provider (e.g. Resend, Postmark, or SMTP via `nodemailer`)
before relying on this for real users.

## Data storage

The API stores everything as JSON files in `server/data/` - there's no
database to set up. Content collections (projects, events, team, etc.) are
tracked in git as the site's real content. Submission data and the admin
`users.json` file (which contains password hashes) are gitignored on purpose.
