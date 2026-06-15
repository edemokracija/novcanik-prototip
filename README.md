# e-Demokracija novčanik

Self-custody EURe novčanik zajednice za **donacije** i **članarine** — brandiran za udrugu
**e-Demokracija**. Logotip u prozi: *e-Demokracija*; grafički wordmark: *e-DEMOKRACIJA*.

> **Faza 1 — design prototip.** Sve je vizualno i koristi *mock* podatke. Nema onchain
> logike. Funkcionalna jezgra (passkey · Safe · relay) dolazi iz
> [`domovinatv/pay.domovina.ai`](https://github.com/) i spaja se u Fazi 3 kao `git submodule`.

## Pokretanje

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # dist/
```

## Arhitektura (plan)

| Faza | Što |
|---|---|
| **1 — prototip (ovo)** | Vite + React + Tailwind, design sistem, mock ekrani. Iteracija izgleda. |
| **2 — ekstrakcija jezgre** | `lib/ + state/ + functions/_lib` iz pay.domovina.ai u konzumabilnu granicu (odspojiti 2 brand-refa: `passkey.ts`, `paperWallet.ts`). |
| **3 — spajanje** | Funkcionalna jezgra kao `git submodule`; ovaj repo zadržava vlastiti UI/branding. Update = `git submodule update`. Intents/wallets preko `mpt.domovina.ai` (dijeljeno), relay vlastiti `/api/relay`. |

## Brand (SSOT: `e-demokracija/upravni-odbor-zapisnici/brand-assets`)

- **Boje (web):** navy `#173863` (primarno), orange `#f7941d` (jedini akcent), pozadina `#edf3f8`.
- **Font:** ZonaPro (Light tijelo / SemiBold naslovi). ⚠️ komercijalan — **potvrditi web-embedding licencu prije javnog produkcijskog deploya.**
- **Potpis:** otisak prsta = brand simbol (i passkey/biometrijski identitet).
- **Glas:** formalan, građanski, transparentnost prije svega. Slogan: *„Vaš glas. Vaša odluka."*
- **Članarina:** `1 € tjedno` + 30 min tjedno (Statut čl. 11). Donacija: preporučeno `30 €/mjesečno`.
- **Privatnost:** donacije anonimne po defaultu; javno ime samo uz GDPR opt-in.

## PWA

Instalabilno (manifest + service worker + iOS `apple-touch-icon`). Na iPhoneu: Safari →
Podijeli → *Dodaj na početni zaslon*.
