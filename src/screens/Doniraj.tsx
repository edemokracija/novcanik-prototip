import { useMemo, useState } from 'react';
import {
  donationPresets,
  solidarity,
  solidarityPresets,
  cardFee,
  CARD_FEE_PCT,
  CARD_FEE_FIXED,
  eur,
} from '../lib/mock';
import { Button, Card, Chip, ScreenTitle } from '../components/ui';
import { FileText, Handshake, Search } from '../components/icons';
import { PaymentConfirm } from '../components/PaymentConfirm';
import { navigate } from '../lib/router';

type Target = 'kampanja' | 'fondovi';

export function Doniraj() {
  const [target, setTarget] = useState<Target>('kampanja');
  const [amount, setAmount] = useState(10);
  const [recurring, setRecurring] = useState(false);
  const [anon, setAnon] = useState(true);
  const [confirming, setConfirming] = useState(false);
  // Demo: prikupljeni iznos kampanje raste nakon uspješne donacije (wow-efekt).
  const [raised, setRaised] = useState(solidarity.raised);

  const isCampaign = target === 'kampanja';
  const presets = isCampaign ? solidarityPresets : donationPresets;

  // Redovita donacija ima smisla samo za trajni doprinos fondovima, ne za
  // kampanju s ciljem → kod prebacivanja na kampanju gasimo je.
  const setTargetSafe = (t: Target) => {
    setTarget(t);
    if (t === 'kampanja') setRecurring(false);
    setAmount(t === 'kampanja' ? 10 : 30);
  };

  // Usporedba naknada: on-chain stiže cijelo, kartica gubi 1,5% + 0,25 €.
  const fee = useMemo(() => cardFee(amount), [amount]);
  const cardArrives = Math.max(0, amount - fee);
  const feePct = amount > 0 ? (fee / amount) * 100 : 0;

  const pct = Math.min(100, Math.round((raised / solidarity.goal) * 100));
  const remaining = Math.max(0, solidarity.goal - raised);

  return (
    <div className="pb-6 animate-riseIn">
      <ScreenTitle
        eyebrow="Doprinos"
        title="Doniraj zajednici"
        sub="Izravan EURe transfer na namjenski račun udruge — bez posrednika i provizije. Cijeli iznos stiže zajednici."
      />

      <div className="space-y-4 px-4">
        {/* Odabir namjene */}
        <div className="grid grid-cols-2 gap-2">
          <TargetButton
            active={isCampaign}
            label="Kampanja zajednice"
            hint="Platforma Agora"
            onClick={() => setTargetSafe('kampanja')}
          />
          <TargetButton
            active={!isCampaign}
            label="Namjenski računi"
            hint="Trajni projekti"
            onClick={() => setTargetSafe('fondovi')}
          />
        </div>

        {/* Kampanja zajednice */}
        {isCampaign ? (
          <Card className="overflow-hidden p-0">
            <div className="flex items-start gap-3 border-b border-hairline px-5 pb-4 pt-5">
              <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-pill bg-orange/10 text-orange">
                <Handshake size={20} strokeWidth={2} aria-hidden />
              </span>
              <div className="min-w-0">
                <Chip tone="live">{solidarity.eyebrow}</Chip>
                <p className="mt-2 text-base font-semibold leading-snug text-navy-ink">{solidarity.title}</p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-4">
              <p className="text-xs leading-relaxed text-muted">{solidarity.story}</p>

              {/* Progress prema cilju */}
              <div className="mt-4">
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-semibold tracking-display tabular-nums text-navy">
                    {eur(raised)}
                  </p>
                  <p className="text-xs text-muted">
                    cilj <span className="font-semibold tabular-nums text-navy-ink">{eur(solidarity.goal)}</span>
                  </p>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-pill bg-navy/10">
                  <div
                    className="h-full rounded-pill bg-orange transition-[width] duration-700 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted">
                  <span className="font-semibold text-orange tabular-nums">{pct}% prikupljeno</span>
                  <span className="tabular-nums">
                    {solidarity.donors} donatora · još {eur(remaining)}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-card bg-navy/5 px-3 py-2.5">
                <Handshake size={15} strokeWidth={2} className="mt-0.5 shrink-0 text-navy" aria-hidden />
                <p className="text-xs leading-relaxed text-muted">
                  <span className="font-semibold text-navy">{solidarity.surplusNote}.</span> Svaka uplata i
                  isplata javno je vidljiva na Gnosis lancu. Iznosi kampanje su ilustrativni demo.
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <div className="flex items-start gap-2 rounded-card bg-navy/5 px-4 py-3">
            <Search size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-navy" aria-hidden />
            <p className="text-xs leading-relaxed text-muted">
              Doprinos ide u namjenske račune udruge — Opći fond, platformu Agora, pravnu analizu
              referenduma i edukaciju građana. Namjenski račun biraš na ekranu{' '}
              <span className="font-semibold text-navy">Projekti</span>.
            </p>
          </div>
        )}

        {/* Iznos */}
        <Card className="p-5">
          <p className="text-center text-xs uppercase tracking-eyebrow text-muted">Iznos donacije</p>
          <p className="mt-1 text-center text-5xl font-semibold tracking-display tabular-nums text-navy">
            {eur(amount)}
          </p>
          <div className={`mt-5 grid gap-2 ${presets.length === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setAmount(p)}
                className={`rounded-pill border py-2.5 text-sm font-semibold transition ${
                  amount === p
                    ? 'border-orange bg-orange text-white'
                    : 'border-chipline bg-chip text-navy hover:border-navy/30'
                }`}
              >
                {eur(p)}
              </button>
            ))}
          </div>
          {!isCampaign && <p className="mt-3 text-center text-xs text-muted">Preporučeno: {eur(30)} mjesečno</p>}

          {/* Usporedba: on-chain vs kartica (mikrodonacije bez provizije) */}
          <div className="mt-5 overflow-hidden rounded-card border border-navy/10">
            <div className="flex items-center justify-between bg-orange/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-pill bg-orange text-white">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span className="text-sm font-semibold text-navy-ink">e-Dem novčanik · on-chain</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums text-navy">stiže {eur(amount)}</p>
                <p className="text-[0.7rem] text-muted">0 € provizije</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-hairline px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-pill bg-navy/10 text-navy">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </span>
                <span className="text-sm text-muted">Kartica · Stripe</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums text-muted">stiže {eur(cardArrives)}</p>
                <p className="text-[0.7rem] text-muted">
                  −{eur(fee)} ({feePct.toFixed(1).replace('.', ',')}%)
                </p>
              </div>
            </div>
          </div>
          <p className="mt-2 text-center text-[0.7rem] leading-relaxed text-muted">
            Kartična naknada {(CARD_FEE_PCT * 100).toFixed(1).replace('.', ',')}% + {eur(CARD_FEE_FIXED)} po
            transakciji „pojede" mikrodonacije. On-chain transfer stiže cijel.
          </p>
          <button
            onClick={() => navigate('/dokumenti/isplativost')}
            className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-[0.72rem] font-semibold text-navy-mid transition hover:text-orange"
          >
            <FileText size={13} strokeWidth={2} aria-hidden /> Zašto je ovo isplativije · projekcije kroz godine →
          </button>
        </Card>

        {/* Opcije */}
        <Card className="divide-y divide-hairline">
          {!isCampaign && (
            <Toggle
              label="Redovita mjesečna donacija"
              hint="Prepaid: jedna potvrda otiskom za N mjeseci, otkažeš kad želiš"
              on={recurring}
              onChange={() => setRecurring((v) => !v)}
            />
          )}
          <Toggle
            label="Anonimna donacija"
            hint={anon ? 'Tvoje ime neće biti javno vidljivo' : 'Tvoje ime bit će javno uz zapis (GDPR opt-in)'}
            on={anon}
            onChange={() => setAnon((v) => !v)}
          />
        </Card>

        <div className="flex items-start gap-2 rounded-card bg-navy/5 px-4 py-3">
          <Search size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-navy" aria-hidden />
          <p className="text-xs leading-relaxed text-muted">
            <span className="font-semibold text-navy">Potpuna transparentnost.</span> Svaka donacija i svaka
            isplata javno su vidljive članstvu kroz auditiranu blockchain platformu.
          </p>
        </div>

        <Button full onClick={() => setConfirming(true)}>
          Doniraj {eur(amount)}
          {recurring ? ' / mjesečno' : ''}
        </Button>
      </div>

      <PaymentConfirm
        open={confirming}
        amount={eur(amount)}
        caption={isCampaign ? 'Kampanja zajednice' : recurring ? 'Mjesečna donacija' : 'Jednokratna donacija'}
        lines={[
          {
            label: isCampaign ? 'Kampanja — Platforma Agora' : 'Doprinos namjenskim računima',
            value: eur(amount),
          },
          { label: 'Provizija (posrednici)', value: eur(0) },
        ]}
        footnote={
          isCampaign
            ? 'Jednokratna donacija kampanji' + (anon ? ' · anonimno' : '')
            : (recurring ? 'Obnavlja se mjesečno — otkažeš kad želiš' : 'Jednokratni doprinos') +
              (anon ? ' · anonimno' : '')
        }
        doneTitle="Donacija uspješna"
        linesTitle="Razdioba"
        onDone={() => {
          if (isCampaign) setRaised((r) => r + amount);
          setConfirming(false);
        }}
      />
    </div>
  );
}

function TargetButton({
  active,
  label,
  hint,
  onClick,
}: {
  active: boolean;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-card border px-3 py-3 text-left transition ${
        active ? 'border-orange bg-orange/5' : 'border-chipline bg-surface hover:border-navy/30'
      }`}
    >
      <span className={`block text-sm font-semibold ${active ? 'text-orange' : 'text-navy-ink'}`}>{label}</span>
      <span className="mt-0.5 block text-xs text-muted">{hint}</span>
    </button>
  );
}

function Toggle({
  label,
  hint,
  on,
  onChange,
}: {
  label: string;
  hint: string;
  on: boolean;
  onChange: () => void;
}) {
  return (
    <button onClick={onChange} className="flex w-full items-center justify-between px-4 py-4 text-left">
      <div className="pr-4">
        <p className="text-sm font-semibold text-navy-ink">{label}</p>
        <p className="mt-0.5 text-xs text-muted">{hint}</p>
      </div>
      <span
        className={`relative h-7 w-12 shrink-0 rounded-pill transition ${on ? 'bg-orange' : 'bg-chipline'}`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-pill bg-white shadow transition-transform ${
            on ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  );
}
