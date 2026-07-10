# BACKPORT-PLAN — nadogradnje iz mlađih grana loze u e-Demokracija novčanik

e-Demokracija novčanik je **sjeme** cijele loze (vidi
`/Users/ms/git/domovinatv/novcanik-template/LOZA-NOVCANIKA.md`), forkan prije nego što su
mlađe grane (template/zef/ss) dobile nove primitive. Ovaj plan ih backporta po receptu
`BACKPORT-FLOW.md` (dokazan na DBHZ-u 07-10), **prilagođene e-Demokracija brandu i
građansko-demokratskom sadržaju**. Kontekst: prototip se za par dana pokazuje Robertu
Postaju (predsjednik Udruge e-Demokracija; ujedno predsjednik NO ZEF-a) — cilj je da
e-Dem prototip ima sve što imaju najnoviji u lozi (ss, dbhz).

## Izvori (lokalni repoi + commitovi — čitaj njihove diffove kao predložak)

| Izvor | Commit | Što |
|---|---|---|
| `/Users/ms/git/domovinatv/novcanik-template` | `90f45da` | lucide ikone + PWA splash (SAMO to — FAB/PushReminder/portal već postoje u e-dem) |
| `/Users/ms/git/domovinatv/novcanik-template` | `8970e19` | Glasovanje ekran kao standardni primitiv |
| `/Users/ms/git/zef/zef-novcanik-prototip` | `65629ef` + `aa9f76c` | compliance dokument „isplativost" (wallet vs. ostali kanali; SEPA skup za mikrouplate) |
| `/Users/ms/git/zef/zef-novcanik-prototip` | `2042382` | Doniraj: solidarna kampanja + fee-free mikrodonacije |
| `/Users/ms/git/ss/ss-novcanik-prototip` | `4041691` | OG/Twitter tagovi (single-tenant pojednostavljenje kao dbhz `9cec505`) |
| `/Users/ms/git/dbhz/dbhz-novcanik-prototip` | `ef26467`–`f5a414d` | već adaptirani backportovi — sekundarni predložak (ista pojednostavljenja) |

## Specifičnosti cilja (e-dem ≠ MUSW klon!)

- e-dem je **stariji od MUSW-a**: nema `Više` sheet, ima 5 tabova (home/doniraj/projekti/
  aktivnost/primi) + `clanarina`/`nagrade` preko Home kartica i desktop nav-a.
- Emojija je MALO (📄 ×4, 💬 ×2, 🔎 ×2, 👇 ×1) — Faza 1 je lagana; ✕/✓/− ostaju (tipografski).
- `PaymentConfirm` postoji (portal na body — gotcha #2) i koristi se u Clanarina + Nagrade;
  Doniraj ga danas NE koristi → Faza 3 ga spaja na Doniraj (kao zef/dbhz).
- Brand: navy `#173863` primarno, orange `#f7941d` jedini akcent; otisak prsta = simbol.
  Splash/OG = **orange otisak (brand/fingerprint.svg) centriran na navy** (rsvg-convert + PIL).
- Činjenice: članarina redovni 1 €/tjedno (Statut čl. 11), UO 3 €/dan; donacije pref. 30 €/mj.

## Faze (redom; svaka = implementacija → verifikacija → commit)

### Faza 1 — Lucide ikone + PWA splash (template `90f45da`, dbhz `ef26467`)
- `npm i lucide-react` (verzija kao template/dbhz).
- `src/components/icons.tsx`: minimalni set (FileText, MessageCircle, Search, Handshake,
  Vote, …) — jednobojno kroz `currentColor`. Bez sectorIcon mape (e-dem nema emoji kategorije).
- Zamijeni emojije: 📄→FileText (App ×2, Aktivnost, Nagrade), 🔎→Search (Doniraj,
  PaymentConfirm), 💬→MessageCircle (FeedbackWidget, FeedbackList), 👇 izbaciti/preformulirati.
- `scripts/gen_splash.py` (PIL + rsvg-convert za SVG→PNG): 12 iOS splash dimenzija —
  orange otisak ~34% širine na navy `#173863`, optički centar na 46% visine; + og-image
  (Faza 4 koristi). `apple-touch-startup-image` linkovi + inline `#ios-splash`
  (standalone-only) u `index.html`, uklanjanje u `main.tsx`.
- ⚠️ Gotchas: ne hardkodirati hex u komponentama (tokeni); SW keš na deployu.

### Faza 2 — Dokument „Isplativost" (zef `65629ef`+`aa9f76c`, dbhz `ccc5f6b`)
- Novi `docs/compliance/isplativost-novcanika.md` po strukturi zef/dbhz, adaptiran:
  **killer-argument = tjedna članarina 1 € (Statut čl. 11)** — fiksni bankovni nalog
  0,25–0,40 € = 25–40% troška donatoru; scenariji: mikrodonacije za namjenske račune
  (Agora, pravna analiza, edukacija), tjedne članarine ~137 aktivnih članova (mock),
  UO 3 €/dan. Iznosi u projekcijama ILUSTRATIVNI (označi).
- Registriraj u `src/docs/DocsPage.tsx` DOCS mapu (`isplativost`) + kartica na `/dokumenti`.
- Mermaid dijagrami slijede postojeći DocsPage pattern (responzivni smjer se prepisuje sam).

### Faza 3 — Solidarna kampanja + fee-usporedba na Doniraj (zef `2042382`, dbhz `59563f1`)
- `Doniraj.tsx`: odabir namjene (Solidarna kampanja / Namjenski računi), kampanja s
  progressom + demo-inkrement, fee-usporedba on-chain vs kartica, mikro-preseti 5/10/25/50 €,
  link na `/dokumenti/isplativost`, **PaymentConfirm flow** (potvrda otiskom).
- e-Dem adaptacija kampanje: **„Pravna obrana referendumske inicijative"** NE — ostati
  apolitičan i unutar postojećeg mocka: kampanja veže postojeći projekt
  **„Platforma Agora — javna infrastruktura sudjelovanja"** (ilustrativno, označi u mock.ts);
  višak → Opći fond udruge.
- `mock.ts`: `solidarity`, `solidarityPresets`, `cardFee`/`CARD_FEE_*` (Stripe EEA 1,5% + 0,25 €).

### Faza 4 — OG/Twitter tagovi + og-image (ss `4041691`, pojednostavljeno kao dbhz `9cec505`)
- Statični `og:`/`twitter:` tagovi u `index.html` (title/description/image/url, locale hr_HR,
  summary_large_image). URL: `https://edemokracija-novcanik.pages.dev`.
- `public/og-image.png` 1200×630 iz `scripts/gen_splash.py` (otisak na navy).

### Faza 5 — Glasovanje (template `8970e19`, dbhz `f5a414d`) — KILLER-FIT za e-DEMOKRACIJU
- `src/screens/Glasovanje.tsx`: 1 osoba = 1 glas, anti-sybil (passkey + članstvo),
  edEUR (soulbound) nagrada za sudjelovanje, transparentni tally onchain; napomena da
  formalne odluke donose Skupština i UO (glasovanje = savjetodavni signal, participativni budžet).
- `mock.ts` polls — e-Dem teme (apolitično, članske odluke; glasovi ILUSTRATIVNI, volumeni
  u skladu sa ~137 aktivnih članova): prioritet namjenskih računa 2027., termin skupštine/
  tribine, tema sljedeće edukacije/radionice.
- **Ulaz: Glasovanje dobiva TAB** (slogan je „Vaš glas. Vaša odluka."!) umjesto `primi`;
  Primi ostaje na Home quick-akcijama + desktop nav. + `SCREEN_DOCS`, `screens.ts` label,
  desktop nav, Home teaser kartica (aktivne ankete).

## Verifikacija (prije svakog commita)

- `npm run build` čist (tsc + vite).
- Vizualno: pravi Chrome kroz chrome-devtools MCP (`new_page` na vite preview, `resize_page`
  390×844, screenshot) — Home, Doniraj, Glasovanje, /dokumenti, /dokumenti/isplativost.
- Klik-test: glasanje (tally se preračuna), donacija kroz PaymentConfirm (demo-inkrement
  kampanje), navigacija tabovima.
- **Ne diraj:** FeedbackWidget/FeedbackList KV logika, InstallPrompt, PushReminder ponašanje,
  mermaid responzivni pattern u DocsPage, postojeći compliance dokumenti (sadržajno).

## Git / deploy higijena

- Commit po fazi (hrvatske poruke, referenca izvornog hasha), bez pusha usred faza ako nešto pukne.
- Na kraju SVEGA: SW cache bump `edem-novcanik-v1` → `v2` u `public/sw.js`, build, deploy
  (komanda u CLAUDE.md, account ID obavezan), hard-refresh provjera live URL-a + `curl`
  og-image/splash/sw.js.
- Ažuriraj CLAUDE.md (nove konvencije: ikone/splash/OG/Glasovanje) + memory.
