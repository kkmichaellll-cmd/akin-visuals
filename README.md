# Akin Visuals

A buildless portfolio with the original artwork, mountain animation, floating navigation, Fulani route overlay, native project dialogs and three MP4 previews. The private review preview serves the frontend. The ZIP also includes the Vercel email function.

## Run locally

Extract the archive. From the folder containing index.html, run `python -m http.server 8000` and open http://localhost:8000. This serves the visual portfolio. To exercise the server-side form, use Vercel CLI's `vercel dev` with local environment variables. Use a separate preview project when linking the CLI. Use Node.js 22 or later.

## Upload to GitHub and deploy a Vercel preview

1. Upload the extracted contents to a repository. Keep index.html, style.css, script.js, assets/ and api/ together at the repository root. Include .gitignore. Only .env.example belongs in Git.
2. Import that repository into a separate Vercel project for testing. Choose the **Other** framework preset, select the repository root, leave the build command empty, and use the project root as the output directory. The api/contact.js Node function handles POST /api/contact. There are no package dependencies.
3. Verify a sending domain in Resend. Create a sending-only API key for that domain. Decide which verified-domain address should send the messages and which business mailbox should receive enquiries.
4. Create a Redis database with the Upstash REST API. Use a server-side read/write token. This stores only a keyed hash of the network address and a counter for ten minutes, shared across function instances.
5. In Vercel Project Settings → Environment Variables, set the variables below for the deployment environment being tested. Redeploy after adding or changing values. For local Vercel testing, copy .env.example to .env.local and supply values there. Keep credentials out of HTML, client-side JavaScript and public variables.
6. Submit one real test enquiry using an address you control. Confirm the message arrives in Stephen’s inbox, check the research field and message, then use Reply and verify the recipient. Check the Resend event log if the mailbox does not receive it. Promote to the live domain only after approval.

| Environment variable | Value |
| --- | --- |
| RESEND_API_KEY | Resend sending key |
| CONTACT_FROM_EMAIL | Plain email address on the verified sending domain |
| CONTACT_TO_EMAIL | Stephen’s actual business email, approved for display in submission errors |
| UPSTASH_REDIS_REST_URL | HTTPS REST endpoint from the Redis database |
| UPSTASH_REDIS_REST_TOKEN | Read/write REST token from that database |

The server validates the form, accepts only the listed project types, rejects the honeypot and foreign browser origins, and limits valid attempts to five per network address per ten minutes. The visitor’s email is used as Reply-To. A successful response requires Resend to return an accepted email ID. An accepted request still needs an inbox check to confirm delivery. Missing configuration or a service failure produces an error and preserves the enquiry in the form.

## Studio edition

The agency voice and three linked publication credits are live in this edition. The original biography, project artwork and descriptions are retained. Sample testimonials, the journal strip and unconfirmed statistics remain hidden. Business email credentials, confirmed social links and a live delivery test remain outstanding.
