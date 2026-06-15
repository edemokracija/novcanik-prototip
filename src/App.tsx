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

  // Full-bleed: app puni cijeli viewport kao prava mobilna aplikacija.
  return (
    <div className="flex h-[100dvh] justify-center overflow-hidden">
      <div className="relative flex h-full w-full max-w-[480px] flex-col overflow-hidden bg-page">{body}</div>
    </div>
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
