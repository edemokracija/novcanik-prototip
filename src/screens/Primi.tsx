import { account } from '../lib/mock';
import { Card, Chip, ScreenTitle } from '../components/ui';

export function Primi() {
  return (
    <div className="pb-6 animate-riseIn">
      <ScreenTitle eyebrow="Primi sredstva" title="Tvoja adresa" sub="Podijeli QR ili adresu za primanje EURe — ili nadoplati SEPA uplatom." />
      <div className="space-y-4 px-4">
        <Card className="flex flex-col items-center p-6">
          {/* mock QR */}
          <div className="grid h-44 w-44 grid-cols-7 grid-rows-7 gap-1 rounded-2xl bg-white p-3 shadow-soft">
            {Array.from({ length: 49 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-[2px] ${[0, 1, 6, 7, 8, 13, 14, 20, 24, 28, 34, 35, 41, 42, 47, 48, 10, 16, 22, 30, 38, 44, 3, 4, 31, 33, 25].includes(i) ? 'bg-navy' : 'bg-transparent'}`}
              />
            ))}
          </div>
          <p className="mt-4 font-semibold text-navy">{account.name}</p>
          <p className="mt-1 rounded-pill bg-chip px-3 py-1 text-sm tabular-nums text-muted">{account.address}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Nadoplata</p>
            <Chip>SEPA</Chip>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Uplatom s bankovnog računa EURe stiže izravno u novčanik. IBAN i poziv na broj generiraju se za svaku
            uplatu.
          </p>
        </Card>
      </div>
    </div>
  );
}
