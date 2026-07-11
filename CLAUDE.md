# CLAUDE.md — e-Demokracija novčanik (prototip)

Naučeno znanje i konvencije za buduće sesije. Čitaj prije rada.

## Što je ovo

**Design prototip** brandiranog self-custody EURe novčanika za **udrugu e-Demokracija** —
prvi pravi DOMOVINA Wallet customer. Faza 1: sve je vizualno, **mock podaci** (`src/lib/mock.ts`),
**nema onchain logike**. GitHub: `edemokracija/novcanik-prototip` (repo namjerno
`-prototip`; ime `novcanik` rezervirano za **pravi** wallet nakon iteracije).

- **Live:** https://edw-prototip.domovina.ai
- **Lokalni dir:** `/Users/ms/git/e-demokracija/novcanik`
- **CF Pages projekt:** `edemokracija-novcanik` (account `7dc7167b7e2e00923bfa7cd697df14e4` = D.O.M.)

## Deploy

```bash
npm run build
CLOUDFLARE_ACCOUNT_ID=7dc7167b7e2e00923bfa7cd697df14e4 \
  npx wrangler pages deploy dist --project-name=edemokracija-novcanik --branch=main --commit-dirty=true
```
⚠️ Account ID se MORA postaviti (repo nema wrangler account config). Nakon deploya:
**service worker kešira** — za novu verziju hard refresh / zatvori-otvori PWA.

## Plan (faze)

1. **Prototip (ovo)** — Vite+React+Tailwind, mock, iteracija dizajna.
2. **Ekstrakcija jezgre** iz `pay.domovina.ai/wallet`: `src/lib/* + src/state/* + functions/_lib/*`
   su brand-agnostični OSIM `lib/passkey.ts` i `lib/paperWallet.ts` (kozmetički `brand.*` — parametrizirati).
3. **Spoji jezgru kao git submodule.** Intents preko `mpt.domovina.ai` (dijeljeno, CORS);
   relay vlastiti `/api/relay` (same-origin Pages Function) ili cross-origin na postojeći.
   Vidi pay.domovina.ai ADR 0015.

## Brand (SSOT: `e-demokracija/upravni-odbor-zapisnici/brand-assets`)

- **Casing:** logotip/wordmark = **`e-DEMOKRACIJA`** (grafički asset, nikad živi tekst);
  proza/ime = **`e-Demokracija`** (veliko D, vodeće `e` uvijek malo).
- **Boje (web, autoritet = živi e-demokracija.hr):** navy `#173863` (primarno), orange `#f7941d`
  (jedini akcent), pozadina `#edf3f8`. Tokeni u `tailwind.config.js`.
- **Font:** ZonaPro (Light tijelo / SemiBold naslovi), WOFF2 u `public/fonts/`.
  ⚠️ **komercijalan** — potvrditi web-embedding licencu prije pravog produkcijskog launcha.
- **Potpis:** otisak prsta = brand simbol + passkey/biometrija (`public/brand/fingerprint.svg`).
- **Glas:** formalan, građanski, transparentnost prije svega. Slogan „Vaš glas. Vaša odluka."
- **Činjenice:** članarina redovni `1 €/tjedno` (Statut čl.11), UO `3 €/dan`; donacija pref. `30 €/mj`;
  donacije anonimne po defaultu, javno ime GDPR opt-in.

## Arhitektura proizvoda (mock, ali odražava pravi dizajn)

- **Self-custody:** Safe na Gnosisu u vlasništvu passkeya; svaka tx = potvrda otiskom; counterfactual adresa do prvog deploya.
- **Članarina:** recurring u self-custodyju = **prepaid** (jedna passkey potvrda za N razdoblja, unatrag+unaprijed) + **push podsjetnik** za re-up. **Nema auto-debita.** Raspodjela na N namjenskih računa = **MultiSend (jedna potvrda, N transfera)**.
- **Namjenski računi** = zasebni projektni Safe-ovi → interni crowdfunding/participativni budžet.
- **edEUR** = neprenosivi (soulbound) loyalty token, potvrda RADA; mint samo udruga, burn pri otkupu; bez P2P → izvan MiCA EMT/EMI; otkup edEUR→EURe iz „fonda za isplate" **diskrecijski** (ne zajamčeni claim). **Faza 2** (`isEMILicenseActive`) otključava P2P samo odlukom **UO Safe multisiga (M-od-N)**, tek uz EMI licencu. Detalji: `docs/compliance/`.

## Dokumentacija s dijagramima

`/dokumenti`, `/dokumenti/uvjeti-koristenja`, `/dokumenti/edeur`, `/dokumenti/porezi` renderiraju
`docs/compliance/*.md` (single source, `?raw` import) s **mermaid** dijagramima. `marked` + `mermaid`
su **lazy chunk** (glavni bundle ostaje malen). Boje u dijagramima: 🟩 porez se plaća, 🟧 olakšica/izuzeće, 🔴 zabrana.

## Gotchas (naučeno teško — ne ponavljaj)

1. **Tailwind base-klasa vs override:** `Card` u bazi ima `bg-surface` (bijelo); dodavanje `bg-navy`
   preko = sukob, bijela pobjeđuje → tekst bijel na bijelom (nevidljivo). Rješenje: `dark` prop na
   `Card`, ne boriti se s bazom dvjema `bg-` klasama.
2. **`position: fixed` unutar transformiranog pretka:** element s `animate-riseIn` (transform, fill-mode)
   pretvara `fixed` potomka u `absolute` (vrh odrezan, probija ga TabBar). Rješenje: **portal na
   `document.body`** za overlaye (`PaymentConfirm`).
3. **Responzivni mermac:** smjer se prepisuje po viewportu — desktop `LR` (horizontalno, full-bleed
   `100vw` + `overflow-x-clip`), mobitel `TB` (vertikalno). Prepisuje se SAMO top-level `flowchart`,
   subgraph `direction` ostaje. Re-render na `matchMedia` promjenu.
4. **CF Pages SW keš:** uvijek hard refresh nakon deploya da se vidi nova verzija.
5. **Hrvatska množina:** koristi `plural(n, [one, few, many])` iz `mock.ts` (tjedan/tjedna/tjedana).
6. **iOS PWA:** `apple-mobile-web-app-capable` + `apple-touch-icon` + manifest; instalacija samo iz Safarija.

## Backport iz loze (07-10)

Repo je „sjeme" loze novčanika (`domovinatv/novcanik-template/LOZA-NOVCANIKA.md`); 07-10
backportani primitivi mlađih grana po receptu `BACKPORT-FLOW.md` (plan: `docs/BACKPORT-PLAN.md`):

- **Lucide ikone** (`src/components/icons.tsx`, currentColor) umjesto emojija — template `90f45da`.
- **PWA splash + OG slika**: `scripts/gen_splash.py` (rsvg-convert + PIL) — orange otisak na navy
  `#173863`; 12 iOS dimenzija + `og-image.png` 1200×630. Regeneriraj skriptom, ne ručno.
- **OG/Twitter tagovi** statični u `index.html` (single-tenant, bez edge middlewarea) — ss `4041691`.
- **Dokument isplativosti** `docs/compliance/isplativost-novcanika.md` (`/dokumenti/isplativost`) —
  killer-argument: tjedna članarina 1 € vs fiksni bankovni nalog 0,25–0,40 € — zef `65629ef`.
- **Kampanja zajednice + fee-usporedba** na Doniraj (mock `solidarity`, `cardFee`) — zef `2042382`;
  kampanja veže postojeći projekt Agora, iznosi ILUSTRATIVNI (označeni u mock.ts).
- **Glasovanje** (`src/screens/Glasovanje.tsx`) — template `8970e19`; ima TAB (slogan!), Primi je
  premješten u Home quick-akcije + desktop nav. 1 osoba = 1 glas, edEUR soulbound nagrada.

## Konvencije

- Sve UI kopije na hrvatskom; iznosi `Intl.NumberFormat('hr-HR', EUR)`.
- Brand-as-data tokeni (navy/orange/...) preko Tailwinda; ne hardkodirati hex u komponentama osim u tokenima/CSS-u.
- Mobile-first; desktop = phone frame + lijevi (brand/nav) i desni (tehnički opis) panel (xl), scroll-to-top na izmjenu ekrana.
