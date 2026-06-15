import { useState } from 'react';
import { edeur, eur, loyalty } from '../lib/mock';
import { Button, Card, FeatureRow, ScreenTitle } from '../components/ui';
import { PaymentConfirm } from '../components/PaymentConfirm';

export function Nagrade() {
  const max = Math.min(loyalty.balance, loyalty.fundAvailable);
  const [amount, setAmount] = useState(loyalty.balance);
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="pb-6 animate-riseIn">
      <ScreenTitle
        eyebrow="Loyalty · edEUR"
        title="Nagrade za rad"
        sub="edEUR je interna potvrda tvog rada za udrugu na blockchainu. Ne može se slati drugima — iz fonda za isplate zamjenjuje se za EURe."
      />

      <div className="space-y-4 px-4">
        {/* edEUR balans */}
        <Card dark className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-eyebrow text-white/55">Zasluženo radom</p>
            <span className="rounded-pill bg-white/12 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide">
              ne-prenosivo
            </span>
          </div>
          <p className="mt-2 text-4xl font-semibold tracking-display tabular-nums">{edeur(loyalty.balance)}</p>
          <p className="mt-1 text-sm text-white/65">≈ {eur(loyalty.balance)} vrijednosti</p>
        </Card>

        {/* Zamjena edEUR → EURe */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Zamijeni za EURe</p>
            <span className="text-xs text-muted">Fond: {eur(loyalty.fundAvailable)} dostupno</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Stepper value={amount} min={1} max={max} onChange={setAmount} />
            <div className="text-right">
              <p className="text-2xl font-semibold tracking-display tabular-nums text-navy">{eur(amount)}</p>
              <p className="text-xs text-muted">primaš u EURe</p>
            </div>
          </div>
          <button
            onClick={() => setAmount(max)}
            className="mt-3 w-full rounded-pill border border-chipline bg-chip py-2 text-sm font-semibold text-navy transition hover:border-navy/30"
          >
            Zamijeni sve ({edeur(max)})
          </button>
          <Button full className="mt-3" onClick={() => setConfirming(true)}>
            Zamijeni {edeur(amount)} → {eur(amount)} · potvrdi otiskom
          </Button>
        </Card>

        {/* Povijest zarade */}
        <div>
          <p className="px-1 pb-2 eyebrow">Zarađeno radom</p>
          <Card className="divide-y divide-hairline">
            {loyalty.log.map((l) => (
              <div key={l.id} className="flex items-center justify-between px-4 py-3.5">
                <div className="min-w-0 pr-3">
                  <p className="truncate text-sm font-semibold text-navy-ink">{l.label}</p>
                  <p className="text-xs text-muted">{l.when}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-navy">+{edeur(l.amount)}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* Kako edEUR radi */}
        <Card className="p-5">
          <p className="eyebrow">Kako edEUR radi</p>
          <ul className="mt-3 space-y-2.5">
            <FeatureRow>Izdaje ga isključivo udruga — kao potvrda tvog rada, ne kupuje se</FeatureRow>
            <FeatureRow>Nije prenosiv drugima (nema P2P razmjene) — vezan je uz tebe</FeatureRow>
            <FeatureRow>Iz fonda za isplate zamjenjuje se za EURe, ovisno o dostupnosti</FeatureRow>
          </ul>
        </Card>
      </div>

      <PaymentConfirm
        open={confirming}
        amount={eur(amount)}
        caption="Zamjena edEUR → EURe"
        doneTitle="Zamjena uspješna"
        linesTitle="Detalji zamjene"
        lines={[
          { label: 'Zamijenjeno', value: edeur(amount) },
          { label: 'Primljeno', value: `${eur(amount)} EURe` },
        ]}
        footnote="Stiglo u tvoj novčanik"
        onDone={() => setConfirming(false)}
      />
    </div>
  );
}

function Stepper({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  const btn =
    'grid h-10 w-10 place-items-center rounded-pill bg-chip text-xl font-semibold text-navy transition hover:bg-chipline disabled:opacity-40';
  return (
    <div className="flex items-center gap-3">
      <button className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Manje">
        −
      </button>
      <span className="w-10 text-center text-xl font-semibold tabular-nums text-navy">{value}</span>
      <button className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Više">
        +
      </button>
    </div>
  );
}
