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

### PayPal (optional second payment option)

For donors who'd rather not enter a card through Paystack (common for
international/diaspora givers), set `PAYPAL_CLIENT_ID`/`PAYPAL_CLIENT_SECRET`
in `server/.env` (see `.env.example`) and `VITE_PAYPAL_CLIENT_ID` in
`client/.env` - a "Pay with PayPal" option then appears under the amount
picker on one-time donations. Get sandbox credentials for free from
[developer.paypal.com](https://developer.paypal.com) to test the whole flow
before ever touching live credentials, same as Paystack's test/live keys.
Left unset (the default), the Donate modal looks and behaves exactly as it
does today - nothing PayPal-related renders or loads.

### Analytics and error monitoring (optional)

Both are entirely opt-in and do nothing until configured - set these in
`client/.env`:

```
VITE_PLAUSIBLE_DOMAIN=www.chadi-international.org
VITE_SENTRY_DSN=https://xxxxxxxx@xxxxx.ingest.sentry.io/xxxxxxx
```

`VITE_PLAUSIBLE_DOMAIN` turns on [Plausible](https://plausible.io) pageview
tracking (cookie-free, GDPR-friendly by design - no cookie consent banner
interaction needed for it specifically). `VITE_SENTRY_DSN` turns on
[Sentry](https://sentry.io) error reporting - unhandled errors caught by the
app's error boundary are sent there instead of just disappearing into a
visitor's console. Get a DSN from Sentry → your project → Settings → Client
Keys.

### Hope Alive Circle (monthly recurring donations)

Choosing "Monthly" in the Donate modal creates a real recurring Paystack
subscription, not just a one-time charge or a lead for follow-up. The first
time anyone picks a given amount, the server asks Paystack for a reusable
billing Plan for that amount (creating one if it doesn't exist yet - see
`plans.json` in `server/data/`), then the checkout popup is opened against
that plan instead of a bare amount. Paystack tokenizes the donor's card on
that first charge and automatically bills it again every month afterwards -
no server-side cron job or scheduled task is involved; Paystack's own
infrastructure does the recurring billing.

Each recurring charge (the first one and every one after it) arrives via
the webhook below as a normal `charge.success` event and is recorded in
Donations same as a one-time payment, just with `type: "subscription"`.
Shortly after the first charge, Paystack also sends a `subscription.create`
event carrying the subscription's code, which is what lets an admin cancel
it later from Admin → Donations → view a subscription entry → Cancel
Subscription. Paystack test mode fully supports plans and subscriptions, so
this can be exercised end-to-end with `sk_test_...`/`pk_test_...` keys
before ever touching a live key.

### Paystack webhook (important - do this before relying on real donations)

The Donate page shows a donor an on-screen confirmation as soon as their
browser gets a response back after paying, but that alone isn't reliable -
if their browser closes or loses connection at the wrong moment, the payment
would succeed on Paystack's side while your site never finds out. A webhook
fixes this: Paystack calls your server directly, independent of the donor's
browser, the moment a payment actually succeeds.

To turn it on:

1. Deploy the API somewhere with a public URL (a webhook can't reach
   `localhost` - see "Testing the webhook locally" below if you want to test
   before deploying).
2. In your Paystack dashboard, go to Settings → API Keys & Webhooks.
3. Set the webhook URL to `https://your-domain.com/api/payments/webhook`.
4. Save. Paystack will send a `charge.success` event here for every
   successful payment, and it's verified using your `PAYSTACK_SECRET_KEY` -
   requests without a valid signature are rejected automatically.

Once this is set, the webhook is the authoritative record of a payment; the
on-screen confirmation via `/api/payments/verify` is just a UX nicety layered
on top; both write to the same donations list and won't double-record the
same transaction.

**Testing the webhook locally**: install the
[Paystack CLI](https://paystack.com/docs/developer-tools/paystack-cli/) or
use a tunnel like [ngrok](https://ngrok.com) (`ngrok http 4000`) to get a
temporary public URL for your local server, then use that URL in the
dashboard while testing.

## Admin dashboard

Visit `/admin/login` on the running site. The first time the server starts,
it seeds one admin account using `ADMIN_EMAIL` / `ADMIN_PASSWORD` (or the
defaults above if those aren't set). **Change this password after your first
login** - go to Admin Users in the dashboard sidebar.

From the dashboard you can manage:

- **Projects, Programs, News, Events, Team, Gallery, Partners, Stories** - full create/edit/delete,
  and changes appear on the public site immediately (no rebuild needed). Image
  fields support uploading a file directly (stored on the server under
  `server/uploads/`) or pasting a URL.
- **Messages, Volunteers, Donations** - view and manage submissions from the
  public Contact, Volunteer and Donate forms. Donations includes both real
  Paystack payments (verified server-side) and "other ways to give" interest
  submissions, shown together with a Type column.
- **Admin Users** - add or remove who can log in to the dashboard.
- **Settings** - the four homepage stat counters, contact email, focus
  region, office hours and social links.

### Email (receipts, password reset, subscriber updates)

All outgoing email goes through `server/src/lib/mailer.js`, which sends via
SMTP if `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` are set (see
`server/.env.example` - works with Gmail via an app password, Resend,
SendGrid, Mailgun, Postmark, etc.) and otherwise logs the content to the
server console instead, so every flow below still works end-to-end locally
without a real provider configured.

- **Password reset** - "Forgot password" logs the reset link to the console
  (and returns it directly in the response outside production) until SMTP
  is configured, at which point it emails the link for real.
- **Donation receipts** - every completed one-time payment or Hope Alive
  Circle charge automatically emails the donor a receipt, fire-and-forget
  (a slow or failed send never delays their on-screen confirmation).
- **Subscriber updates** - from Admin → Projects or Admin → News, the
  megaphone icon next to any entry opens a pre-filled email (editable
  before sending) that goes out individually to everyone on the newsletter
  list - use it to announce a new or updated project or article.

## Rate limiting

The API applies a generous baseline limit (300 requests / 15 min per IP) to
everything under `/api`, plus stricter limits on the routes most worth
protecting: 5 submissions / 15 min per IP on the public Contact, Volunteer,
Newsletter and Donate-interest forms, and 10 attempts / 15 min per IP on
login/forgot-password/reset-password. A real visitor should never notice
either limit; scripted spam/abuse will.

## Adding a second language

The client is wired up with `react-i18next` (see `client/src/i18n.js`), but
English (`client/src/locales/en/common.json`) is the only complete language -
the Navbar is the one place currently wired through it, as a working example
of the pattern rather than a finished multi-language site. To add a real
language: create `client/src/locales/<code>/common.json` with the same keys,
register it in `i18n.js`'s `resources`, and convert more components from
plain text to `t("key")` the same way Navbar.jsx does. Get any translation
reviewed by a native or professional speaker before publishing it - an
inaccurate machine translation of program, health or safety information is a
real risk for a nonprofit's public site, not just a typo.

## Data storage

The API stores everything as JSON files in `server/data/` - there's no
database to set up. Content collections (projects, events, team, etc.) are
tracked in git as the site's real content. Submission data and the admin
`users.json` file (which contains password hashes) are gitignored on purpose.

Uploaded images (`server/uploads/`) are stored on local disk and gitignored
by default - fine for a VPS with persistent storage, but this means uploaded
images live only on whichever server/disk is running the API. If you
redeploy to a new server or the disk is lost, uploaded images go with it
(your seeded content images in `client/public/uploads/` are unaffected -
those are committed to git).

For ephemeral hosts (Render, Railway, Heroku, etc.) where the filesystem is
wiped on every redeploy, set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`
and `CLOUDINARY_API_SECRET` (see `server/.env.example`) - once configured,
new uploads go straight to Cloudinary instead of local disk, with no other
code changes needed. Existing local-disk uploads aren't migrated
automatically if you turn this on later.

## Deployment

Each app has its own `Dockerfile` (`server/Dockerfile`, `client/Dockerfile`
building to a static `nginx` image), plus a root `docker-compose.yml` that
runs both together for local production-parity testing:

```bash
# fill in server/.env first (see server/.env.example)
docker compose up --build
```

This serves the client at `http://localhost:8080` and the API at
`http://localhost:4000`. `server/data` and `server/uploads` are mounted as
named volumes so content and local-disk uploads survive container restarts
(set up Cloudinary instead if you're deploying to a host without persistent
volumes - see above).

The client's `VITE_*` env vars are baked in at build time, not read at
runtime - pass them as build args (`docker-compose.yml` reads
`VITE_API_URL`/`VITE_PAYSTACK_PUBLIC_KEY`/`VITE_SITE_URL` from your shell
environment, or `docker build --build-arg VITE_API_URL=... ./client`
directly).

Not tied to Docker: the client is also just a static build
(`npm run build` → `client/dist/`) deployable to any static host (Netlify,
Vercel, Cloudflare Pages, S3+CloudFront, etc.), and the server is a plain
Node/Express app (`npm start`) deployable anywhere Node runs. A GitHub
Actions workflow (`.github/workflows/ci.yml`) runs lint, tests and the
client build on every push and pull request.
