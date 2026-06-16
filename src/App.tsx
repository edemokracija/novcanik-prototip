import { useEffect, useState } from 'react';
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

  // Mock push: članarina ističe → re-up. Pojavi se kratko nakon ulaska.
  useEffect(() => {
    if (!entered) return;
    const t = setTimeout(() => setPush(true), 2500);
    return () => clearTimeout(t);
  }, [entered]);

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
      <div className="flex-1 overflow-y-auto">
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

  // Mobile: full-bleed (bez okvira). Desktop (md+): phone frame + poveznice okolo.
  return (
    <div className="min-h-[100dvh] md:flex md:items-center md:justify-center md:gap-10 md:p-10 lg:gap-16">
      <DesktopSurround navigate={navigate} />
      <div
        className="relative mx-auto flex h-[100dvh] w-full max-w-[480px] flex-col overflow-hidden bg-page md:mx-0 md:h-[86vh] md:max-h-[860px] md:min-h-[620px] md:w-[392px] md:flex-none md:rounded-[2.75rem] md:border-[12px] md:border-navy md:shadow-card md:ring-1 md:ring-black/5"
      >
        {body}
      </div>
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
    <aside className="hidden w-full max-w-sm md:block">
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
