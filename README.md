# V-Analyst — Vinted Helper PWA

Mobile PWA für Vinted-Listings. Foto rein → KI-Analyse → fertiges Listing → Copy in Vinted.

**Stack:** React 18 + Vite + Tailwind + vite-plugin-pwa + localStorage  
**AI:** Google Gemini (Flash/Pro) via Cloudflare Worker Proxy  
**Hosting:** Cloudflare Pages (Frontend) + Cloudflare Workers (API)

## Lokal entwickeln

```bash
npm install
npm run dev
```

Geht auf `http://localhost:5173`. Ohne `VITE_WORKER_URL` läuft alles außer KI-Analyse.

## Worker (KI-Proxy)

```bash
cd worker
npm install
npx wrangler login          # einmal, Browser-OAuth
npx wrangler secret put GEMINI_API_KEY   # paste den Key, Enter
npx wrangler deploy
```

Output zeigt Worker-URL (`https://vinted-helper-api.<dein-subdomain>.workers.dev`).

## Frontend deployen (Cloudflare Pages)

**Variante A — via Wrangler CLI:**

```bash
npm run build
npx wrangler pages project create vinted-helper --production-branch=main
npx wrangler pages deploy dist --project-name=vinted-helper
```

**Variante B — via Dashboard (Auto-Deploy aus GitHub):**

1. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
2. Repo `v-Analyst` wählen
3. Framework: **Vite**, Build: `npm run build`, Output: `dist`
4. Environment variable: `VITE_WORKER_URL` = Worker-URL aus oben
5. Deploy

## Gemini API Key

Gratis: https://aistudio.google.com/apikey  
Limits Free Tier: 15 Req/min, 1500 Req/Tag (reicht für 750+ Items/Tag bei 2 Calls).

## Datenmodell

Items leben in `localStorage` unter Key `vh.items`. JSON-Export in Settings.
