# secrets.md — Reference values

> **Security note:** several real credentials previously committed to this file
> (Firebase web config, GitHub PAT, MailerLite token, OpenAI key, Whop key,
> Vercel token, and others) have been removed. Treat any value that ever
> appeared here as compromised and rotate it. Future secrets must live in
> Vercel / Doppler / 1Password — not in the repo.
>
> Firebase has been removed from audiojones.com — see
> `docs/architecture/stack-decision.md`.

### ImageKit.io

- Endpoint: `https://ik.imagekit.io/audiojones`
- Public/private keys: rotate and store in Vercel env (`IMAGEKIT_PUBLIC_KEY`,
  `IMAGEKIT_PRIVATE_KEY`).

### Local dev tokens (rotated)

The following secrets used to live here in plaintext. Rotate them and place
the new values in Doppler / 1Password:

- `LOCALAUDIOJONES_VERCEL_DEV`
- `LOCAL_GITHUB_AUDIOJONES_DEV`
- `LOCAL_WHOP_AUDIOIJONES_DEV`
- `LOCAL_MAILERLITE_AUDIOJONES_DEV`
- `LOCAL_DEV_OPENAI_TOKEN`
