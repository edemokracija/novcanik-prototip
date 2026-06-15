import { useState } from 'react';
import { dmy, eur, plural, tiers, type TierKey } from '../lib/mock';
import { Button, Card, Chip, FeatureRow, ScreenTitle } from '../components/ui';

export function Clanarina() {
  const [tierKey, setTierKey] = useState<TierKey>('redovni');
  const tier = tiers[tierKey];
  const [prepay, setPrepay] = useState(tier.presets[1]);
  const [settle, setSettle] = useState(true);

  // Iznos = (podmiri unatrag) + (plati unaprijed)
  const backward = settle ? tier.owed * tier.rate : 0;
  const forward = prepay * tier.rate;
  const total = backward + forward;

  // "Plaćeno do" ≈ danas + (unaprijed razdoblja)
  const paidThrough = new Date(Date.now() + prepay * tier.periodDays * 86_400_000);

  const setTier = (k: TierKey) => {
    setTierKey(k);
    setPrepay(tiers[k].presets[1]);
    setSettle(true);
  };

  return (
    <div className="pb-6 animate-riseIn">
      <ScreenTitle
        eyebrow="Aktivno članstvo"
        title="Tvoja članarina"
        sub="Plati unaprijed za više razdoblja — jedna potvrda otiskom, pa zaboraviš (set & forget). Podmiri i unatrag ako je ostalo neplaćeno."
      />

      <div className="space-y-4 px-4">
        {/* Kategorija članstva */}
        <div className="grid grid-cols-2 gap-2 rounded-pill bg-chip p-1">
          {(Object.keys(tiers) as TierKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setTier(k)}
              className={`rounded-pill px-3 py-2.5 text-center transition ${
                tierKey === k ? 'bg-surface shadow-soft' : 'text-muted hover:text-navy'
              }`}
            >
              <span className={`block text-sm font-semibold ${tierKey === k ? 'text-navy' : ''}`}>
                {tiers[k].label}
              </span>
              <span className="block text-xs text-muted">
                {eur(tiers[k].rate)} {tiers[k].adverb}
              </span>
            </button>
          ))}
        </div>

        {/* Status — navy */}
        <Card dark className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-eyebrow text-white/55">Status · plaćeno do</p>
            <Chip tone="live">Aktivno</Chip>
          </div>
          <p className="mt-2 text-3xl font-semibold tracking-display">{dmy(paidThrough)}</p>
          <p className="mt-1 text-sm text-white/65">
            {prepay} {plural(prepay, tier.unit)} unaprijed · {eur(tier.rate)} {tier.adverb}
          </p>
        </Card>

        {/* Prepaid */}
        <Card className="p-5">
          <p className="eyebrow">Plati unaprijed</p>
          <div className="mt-3 flex items-center justify-between">
            <Stepper value={prepay} onChange={(n) => setPrepay(Math.max(1, n))} />
            <div className="text-right">
              <p className="text-2xl font-semibold tracking-display tabular-nums text-navy">{eur(forward)}</p>
              <p className="text-xs text-muted">
                {prepay} {plural(prepay, tier.unit)}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {tier.presets.map((p) => (
              <button
                key={p}
                onClick={() => setPrepay(p)}
                className={`rounded-pill border px-3 py-1.5 text-sm font-semibold transition ${
                  prepay === p
                    ? 'border-orange bg-orange text-white'
                    : 'border-chipline bg-chip text-navy hover:border-navy/30'
                }`}
              >
                {p} {plural(p, tier.unit)}
              </button>
            ))}
          </div>
        </Card>

        {/* Podmiri unatrag (samo ako ima duga) */}
        {tier.owed > 0 && (
          <button
            onClick={() => setSettle((v) => !v)}
            className="flex w-full items-center justify-between rounded-card border border-chipline bg-surface px-4 py-4 text-left"
          >
            <div className="pr-4">
              <p className="text-sm font-semibold text-navy-ink">Podmiri unatrag</p>
              <p className="mt-0.5 text-xs text-muted">
                {tier.owed} {plural(tier.owed, tier.unit)} neplaćeno · {eur(tier.owed * tier.rate)}
              </p>
            </div>
            <span className={`relative h-7 w-12 shrink-0 rounded-pill transition ${settle ? 'bg-orange' : 'bg-chipline'}`}>
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-pill bg-white shadow transition-all ${
                  settle ? 'left-[1.55rem]' : 'left-0.5'
                }`}
              />
            </span>
          </button>
        )}

        {/* Ukupno + CTA */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Ukupno za platiti</span>
            <span className="text-2xl font-semibold tracking-display tabular-nums text-navy">{eur(total)}</span>
          </div>
          {backward > 0 && (
            <p className="mt-1 text-right text-xs text-muted">
              {eur(backward)} unatrag + {eur(forward)} unaprijed
            </p>
          )}
          <Button full className="mt-4">
            Plati {eur(total)} · potvrdi otiskom
          </Button>
        </Card>

        {/* Kako naplata radi (self-custody) */}
        <Card className="p-5">
          <p className="eyebrow">Kako naplata radi</p>
          <ul className="mt-3 space-y-2.5">
            <FeatureRow>Ništa se ne tereti bez tvog odobrenja — svaku uplatu potvrđuješ otiskom prsta</FeatureRow>
            <FeatureRow>Prepaid = jedna potvrda pokriva sva plaćena razdoblja (set & forget)</FeatureRow>
            <FeatureRow>Kad članarina ističe, stiže podsjetnik — produžiš jednim tapom</FeatureRow>
          </ul>
        </Card>

        {/* Benefiti */}
        <Card className="p-5">
          <p className="eyebrow">Što dobivaš</p>
          <ul className="mt-3 space-y-2.5">
            <FeatureRow>Pun uvid u rad udruge i kako se troši svaki euro</FeatureRow>
            <FeatureRow>Pravo predlaganja sadržaja na platformi Agora</FeatureRow>
            <FeatureRow>Glas u odlukama zajednice i referendumskim pitanjima</FeatureRow>
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Stepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const btn = 'grid h-10 w-10 place-items-center rounded-pill bg-chip text-xl font-semibold text-navy transition hover:bg-chipline disabled:opacity-40';
  return (
    <div className="flex items-center gap-3">
      <button className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Manje">
        −
      </button>
      <span className="w-8 text-center text-xl font-semibold tabular-nums text-navy">{value}</span>
      <button className={btn} onClick={() => onChange(value + 1)} aria-label="Više">
        +
      </button>
    </div>
  );
}
