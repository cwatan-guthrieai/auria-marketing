# Auria Music — marketing site

Public product introduction and About. Separate from the Auria portal (`sonica-portal` on port 3939).

```bash
pnpm install
pnpm dev
```

Opens at [http://localhost:4040](http://localhost:4040). Welcome scan: `/welcome`.

Artist name suggestions use the Soundcharts search API via a local Vite route. Copy `SOUNDCHARTS_APP_ID` and `SOUNDCHARTS_API_KEY` into `.env.local`, or keep them in sibling `auria-platform/.env`.

Waitlist signups post to `/api/waitlist` and are added to Resend Contacts.

1. In [Resend](https://resend.com/audiences), create a Segment for the invite list and copy its ID.
2. Create an API key with **Full access** (send-only keys cannot add contacts).
3. Add to `.env.local`:

```bash
RESEND_API_KEY=re_...
RESEND_SEGMENT_ID=...
```

Local dev also falls back to `EMAIL_RESEND_API_KEY` in sibling `auria-platform/.env`, but that platform key is usually send-only — use a dedicated marketing key for the waitlist.
