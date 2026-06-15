import { account, eur } from '../lib/mock';
import { Button, Card, Chip, FeatureRow, ScreenTitle } from '../components/ui';

const levels = ['Glasnik', 'Tribun', 'Praeco', 'Orator'];

export function Clanarina() {
  const idx = levels.indexOf(account.level);
  return (
    <div className="pb-6 animate-riseIn">
      <ScreenTitle
        eyebrow="Aktivno članstvo"
        title="Tvoja članarina"
        sub="Aktivni član daje 1 € tjedno i u prosjeku 30 minuta tjedno za zajednicu — i dobiva pun uvid u rad udruge te pravo predlaganja sadržaja."
      />

      <div className="space-y-4 px-4">
        <Card dark className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-eyebrow text-white/55">Status</p>
            <Chip tone="live">Aktivno</Chip>
          </div>
          <p className="mt-2 text-3xl font-semibold tracking-display">
            {eur(account.weeklyDues)} <span className="text-lg text-white/60">/ tjedno</span>
          </p>
          <p className="mt-1 text-sm text-white/65">Sljedeća naplata: ponedjeljak, 08:00</p>
        </Card>

        <Card className="p-5">
          <p className="eyebrow">Što dobivaš</p>
          <ul className="mt-3 space-y-2.5">
            <FeatureRow>Pun uvid u rad udruge i kako se troši svaki euro</FeatureRow>
            <FeatureRow>Pravo predlaganja sadržaja na platformi Agora</FeatureRow>
            <FeatureRow>Glas u odlukama zajednice i referendumskim pitanjima</FeatureRow>
          </ul>
        </Card>

        <Card className="p-5">
          <p className="eyebrow">Razina angažmana</p>
          <div className="mt-3 flex items-center justify-between">
            {levels.map((l, i) => (
              <div key={l} className="flex flex-1 flex-col items-center">
                <div
                  className={`grid h-9 w-9 place-items-center rounded-pill text-xs font-semibold ${
                    i <= idx ? 'bg-orange text-white' : 'bg-chip text-muted'
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`mt-1.5 text-[0.7rem] ${i <= idx ? 'font-semibold text-navy' : 'text-muted'}`}>
                  {l}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Trenutna razina: <span className="font-semibold text-navy">{account.level}</span>. Napreduješ
            redovitim doprinosom i sudjelovanjem na platformi Agora.
          </p>
        </Card>

        <Button variant="navy" full>
          Upravljaj članarinom
        </Button>
      </div>
    </div>
  );
}
