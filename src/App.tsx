import { useEffect, useRef, useState } from 'react';
import { Onboarding } from './screens/Onboarding';
import { Home } from './screens/Home';
import { Doniraj } from './screens/Doniraj';
import { Clanarina } from './screens/Clanarina';
import { Aktivnost } from './screens/Aktivnost';
import { Primi } from './screens/Primi';
import { Projekti } from './screens/Projekti';
import { Nagrade } from './screens/Nagrade';
import { PushReminder } from './components/PushReminder';

export type Screen = 'home' | 'doniraj' | 'clanarina' | 'projekti' | 'nagrade' | 'aktivnost' | 'primi';

const TABS: { key: Screen; label: string; icon: string }[] = [
  { key: 'home', label: 'Početna', icon: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10' },
  { key: 'doniraj', label: 'Doniraj', icon: 'M12 21s-7-4.5-7-10a4 4 0 017-2 4 4 0 017 2c0 5.5-7 10-7 10z' },
  { key: 'projekti', label: 'Projekti', icon: 'M12 2 2 7l10 5 10-5-10-5zM2 12l10 5 10-5M2 17l10 5 10-5' },
  { key: 'aktivnost', label: 'Aktivnost', icon: 'M4 18V9M9 18V4M14 18v-6M19 18v-9' },
  { key: 'primi', label: 'Primi', icon: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM16 16h4v4h-4z' },
];

export function App() {
  const [entered, setEntered] = useState(false);
  const [screen, setScreen] = useState<Screen>('home');
  const [push, setPush] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock push: članarina ističe → re-up. Pojavi se kratko nakon ulaska.
  useEffect(() => {
    if (!entered) return;
    const t = setTimeout(() => setPush(true), 2500);
    return () => clearTimeout(t);
  }, [entered]);

  // Scroll na vrh pri svakoj izmjeni ekrana (tab/nav).
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [screen, entered]);

  // Otvori app na zadanom ekranu (koristi desktop surround za navigaciju).
  const navigate = (s: Screen) => {
    setEntered(true);
    setScreen(s);
  };

  const body = !entered ? (
    <Onboarding onEnter={() => setEntered(true)} />
  ) : (
    <>
      {push && (
        <PushReminder
          onOpen={() => {
            setPush(false);
            setScreen('clanarina');
          }}
          onDismiss={() => setPush(false)}
        />
      )}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {screen === 'home' && <Home go={setScreen} />}
        {screen === 'doniraj' && <Doniraj />}
        {screen === 'clanarina' && <Clanarina />}
        {screen === 'projekti' && <Projekti />}
        {screen === 'nagrade' && <Nagrade />}
        {screen === 'aktivnost' && <Aktivnost />}
        {screen === 'primi' && <Primi />}
      </div>
      <TabBar screen={screen} go={setScreen} />
    </>
  );

  // Mobile: full-bleed (bez okvira). Desktop: phone frame + poveznice (xl) i tehnički opis (xl).
  return (
    <div className="min-h-[100dvh] md:flex md:items-center md:justify-center md:gap-8 md:p-8 xl:gap-10">
      <DesktopSurround navigate={navigate} />
      <div
        className="relative mx-auto flex h-[100dvh] w-full max-w-[480px] flex-col overflow-hidden bg-page md:mx-0 md:h-[86vh] md:max-h-[860px] md:min-h-[620px] md:w-[392px] md:flex-none md:rounded-[2.75rem] md:border-[12px] md:border-navy md:shadow-card md:ring-1 md:ring-black/5"
      >
        {body}
      </div>
      <DesktopDocs screen={entered ? screen : 'onboarding'} />
    </div>
  );
}

/** Desktop okvir: wordmark, tagline i poveznice oko phone framea. Skriveno na mobitelu. */
function DesktopSurround({ navigate }: { navigate: (s: Screen) => void }) {
  const navLinks: { label: string; s: Screen }[] = [
    { label: 'Početna', s: 'home' },
    { label: 'Članarina', s: 'clanarina' },
    { label: 'Projekti', s: 'projekti' },
    { label: 'Nagrade · edEUR', s: 'nagrade' },
    { label: 'Doniraj', s: 'doniraj' },
    { label: 'Aktivnost', s: 'aktivnost' },
  ];
  return (
    <aside className="hidden w-full max-w-sm xl:block">
      <img src="/brand/logo-horizontal.svg" alt="e-Demokracija" className="h-7" />
      <h2 className="mt-6 text-4xl font-semibold leading-[0.98] tracking-display text-navy">
        Vaš glas.
        <br />
        Vaša odluka.
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Novčanik zajednice — self-custody EURe za donacije i članarine, namjenski računi i edEUR nagrade za rad.
        Ovo je interaktivni prototip.
      </p>

      <p className="mt-8 eyebrow">Otvori ekran</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {navLinks.map((l) => (
          <button
            key={l.s}
            onClick={() => navigate(l.s)}
            className="rounded-pill border border-chipline bg-surface px-3 py-1.5 text-sm font-semibold text-navy transition hover:border-orange hover:text-orange"
          >
            {l.label}
          </button>
        ))}
      </div>

      <p className="mt-8 eyebrow">Poveznice</p>
      <div className="mt-2 flex flex-col gap-1.5 text-sm">
        <a href="https://www.e-demokracija.hr" target="_blank" rel="noreferrer" className="text-navy-mid transition hover:text-orange">
          www.e-demokracija.hr ↗
        </a>
        <a href="mailto:info@e-demokracija.hr" className="text-navy-mid transition hover:text-orange">
          info@e-demokracija.hr
        </a>
      </div>

      <p className="mt-8 text-xs leading-relaxed text-muted">
        Udruga e-Demokracija · OIB 70011366813
        <br />
        Remete 52, Zagreb
      </p>
    </aside>
  );
}

/** Tehnički opis trenutnog ekrana + arhitektonske/compliance odluke (desktop, xl+). */
type DocKey = Screen | 'onboarding';
const SCREEN_DOCS: Record<DocKey, { title: string; points: string[] }> = {
  onboarding: {
    title: 'Onboarding · self-custody',
    points: [
      'Safe (pametni ugovor) na Gnosisu u vlasništvu passkeya; Udruga nema pristup sredstvima.',
      'Bez seed-a i lozinki — WebAuthn passkey (Face ID/Touch ID), ključ u Apple/Google Keychainu.',
      'Adresa je counterfactual (CREATE2); Safe se deploya pri prvoj transakciji (MultiSend).',
    ],
  },
  home: {
    title: 'Početna · EURe + pregled',
    points: [
      'EURe = Monerium token e-novca (1:1 EUR) na Gnosisu — regulirano sredstvo.',
      'Stanje i sve transakcije čitaju se onchain; potpuna transparentnost je #1 vrijednost.',
      'Članstvo: aktivni član 1 €/tjedno (UO 3 €/dan), Statut čl. 11.',
      'Svaka akcija traži potvrdu otiskom — ništa se ne tereti bez korisnika.',
    ],
  },
  doniraj: {
    title: 'Doniraj · namjenski transfer',
    points: [
      'Donacija = EURe transfer na namjenski Safe; bez provizija i posrednika.',
      'Anonimno po defaultu (GDPR); javno ime samo uz izričitu opt-in privolu.',
      'Redovita donacija = ponovljeni intent koji korisnik potvrđuje otiskom (self-custody, bez auto-terećenja).',
    ],
  },
  clanarina: {
    title: 'Članarina · prepaid model',
    points: [
      'Recurring u self-custodyju nema auto-debita → prepaid: jedna passkey potvrda za N razdoblja (set & forget).',
      'Kategorije: redovni 1 €/tjedno, UO 3 €/dan; podmiruje se unatrag i unaprijed u istoj transakciji.',
      'Raspodjela na N namjenskih računa ide kao jedna MultiSend transakcija (atomično, jedna potvrda).',
      'Push podsjetnik za re-up kad članarina ističe. Allowance/Zodiac modul odbijen — čuva self-custody.',
    ],
  },
  projekti: {
    title: 'Projekti · interni crowdfunding',
    points: [
      'Svaki projekt = zaseban namjenski Safe (analogno per-campaign Safeu).',
      'Član sam usmjerava članarinu i donacije → participativni budžet zajednice.',
      'Doprinosi javni i auditabilni na Gnosisu (raised/goal/broj članova).',
    ],
  },
  nagrade: {
    title: 'Nagrade · edEUR loyalty',
    points: [
      'edEUR = neprenosivi (soulbound) ERC-20; mintsa samo Udruga kao potvrdu rada, burn pri otkupu.',
      'Bez P2P → izvan MiCA EMT / EMI okvira (loyalty / limited-network exemption).',
      'Otkup edEUR→EURe iz fonda za isplate je diskrecijski (ne zajamčeni 1:1 claim) — granica koja ga drži izvan EMT-a.',
      'Faza 2 (P2P): zastavicu isEMILicenseActive mijenja SAMO UO Safe multisig (M-od-N), tek uz EMI licencu — nikad pojedinac.',
    ],
  },
  aktivnost: {
    title: 'Aktivnost · javni zapisnik',
    points: [
      'Zapis transfera čita se onchain (getLogs) na Gnosisu — nepromjenjivo i auditabilno.',
      'Donatori su anonimni (pseudonim) dok ne daju GDPR privolu za javno ime.',
      'Načelo: „svaka uplata i isplata javno vidljiva članstvu".',
    ],
  },
  primi: {
    title: 'Primi · QR + SEPA',
    points: [
      'Primanje EURe preko QR/adrese Safea (EIP-681 format).',
      'SEPA nadoplata: payment intent → dijeljeni backend (mpt.domovina.ai) → Monerium most banka→EURe.',
      'Adresa je counterfactual do prvog deploya Safea.',
    ],
  },
};

function DesktopDocs({ screen }: { screen: DocKey }) {
  const doc = SCREEN_DOCS[screen];
  return (
    <aside className="hidden w-full max-w-xs xl:block xl:max-h-[86vh] xl:overflow-y-auto">
      <p className="eyebrow">Tehnički detalji</p>
      <h3 className="mt-1 text-2xl font-semibold tracking-display text-navy">{doc.title}</h3>
      <ul className="mt-4 space-y-3">
        {doc.points.map((p, i) => (
          <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-navy-ink">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-pill bg-orange" aria-hidden />
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 border-t border-hairline pt-4 text-xs leading-relaxed text-muted">
        Detalji i pravna analiza: <span className="font-semibold text-navy">docs/compliance/</span> — Uvjeti
        korištenja + edEUR loyalty bilješka (s mermaid dijagramima).
      </p>
    </aside>
  );
}

function TabBar({ screen, go }: { screen: Screen; go: (s: Screen) => void }) {
  return (
    <nav className="flex items-stretch justify-around border-t border-hairline bg-surface/95 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      {TABS.map((t) => {
        const active = screen === t.key || (t.key === 'doniraj' && screen === 'clanarina');
        return (
          <button
            key={t.key}
            onClick={() => go(t.key)}
            className={`flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[0.62rem] font-semibold transition ${
              active ? 'text-orange' : 'text-muted hover:text-navy'
            }`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={t.icon} />
            </svg>
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}
