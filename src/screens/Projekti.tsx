import { eur, projects } from '../lib/mock';
import { Card, ScreenTitle } from '../components/ui';

export function Projekti() {
  return (
    <div className="pb-6 animate-riseIn">
      <ScreenTitle
        eyebrow="Interna crowdfunding platforma"
        title="Projekti udruge"
        sub="Svaki projekt je zaseban namjenski račun. Članovi sami usmjeravaju članarinu i donacije u projekte koje žele podržati — sve javno i auditabilno."
      />
      <div className="space-y-3 px-4">
        {projects.map((p) => {
          const pct = Math.min(100, Math.round((p.raised / p.goal) * 100));
          return (
            <Card key={p.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-navy">{p.name}</p>
                    {p.central && (
                      <span className="rounded-pill bg-navy/10 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-navy">
                        osnovni
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm leading-snug text-muted">{p.desc}</p>
                </div>
                <span className="shrink-0 rounded-pill bg-chip px-2 py-1 text-[0.7rem] tabular-nums text-muted">
                  {p.address}
                </span>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <span className="text-xl font-semibold tracking-display tabular-nums text-navy">
                  {eur(p.raised)}
                </span>
                <span className="pb-0.5 text-sm text-muted">od {eur(p.goal)}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-pill bg-chipline">
                <div
                  className="h-full rounded-pill"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#f7941d,#ffb44d)' }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted">
                <span>{p.contributors} članova doprinijelo</span>
                <span className="font-semibold text-navy-mid">{pct}%</span>
              </div>
            </Card>
          );
        })}
        <p className="px-1 pt-1 text-center text-xs text-muted">
          Namjenski računi na Gnosis lancu · doprinosi javno vidljivi
        </p>
      </div>
    </div>
  );
}
