import { community, eur, ledger } from '../lib/mock';
import { Card, ScreenTitle } from '../components/ui';
import { navigate } from '../lib/router';
import { FileText } from '../components/icons';

const kindMeta: Record<string, { label: string; sign: string; color: string }> = {
  donacija: { label: 'Donacija', sign: '+', color: 'text-navy' },
  clanarina: { label: 'Članarina', sign: '−', color: 'text-muted' },
  primljeno: { label: 'Primljeno (SEPA)', sign: '+', color: 'text-navy' },
};

export function Aktivnost() {
  return (
    <div className="pb-6 animate-riseIn">
      <ScreenTitle
        eyebrow="Javni zapisnik"
        title="Aktivnost"
        sub="Potpuna transparentnost: svaka uplata i isplata javno je vidljiva. Donatori su anonimni dok se sami ne odluče otkriti ime."
      />

      <div className="px-4">
        <Card className="mb-4 flex items-center justify-between p-4">
          <div>
            <p className="eyebrow">Ukupno prikupljeno</p>
            <p className="mt-1 text-2xl font-semibold tracking-display tabular-nums text-navy">
              {eur(community.totalRaised)}
            </p>
          </div>
          <div className="text-right">
            <p className="eyebrow">Aktivnih članova</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-navy">{community.activeMembers}</p>
          </div>
        </Card>

        <Card className="divide-y divide-hairline">
          {ledger.map((t) => {
            const m = kindMeta[t.kind];
            return (
              <div key={t.id} className="flex items-center justify-between px-4 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy-ink">{t.who}</p>
                  <p className="text-xs text-muted">
                    {m.label} · {t.when}
                    {t.recurring ? ' · redovito' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 pl-3">
                  <span className="rounded-pill bg-chip px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-muted">
                    javno
                  </span>
                  <span className={`text-sm font-semibold tabular-nums ${m.color}`}>
                    {m.sign}
                    {eur(t.amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </Card>
        <p className="mt-3 px-1 text-center text-xs text-muted">
          Zapis na Gnosis lancu · auditabilno i nepromjenjivo
        </p>
        <button
          onClick={() => navigate('/dokumenti/porezi')}
          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-pill border border-chipline bg-chip py-2.5 text-sm font-semibold text-navy transition hover:border-orange hover:text-orange"
        >
          <FileText size={15} strokeWidth={2} aria-hidden /> Kako se vide porezi onchain →
        </button>
      </div>
    </div>
  );
}
