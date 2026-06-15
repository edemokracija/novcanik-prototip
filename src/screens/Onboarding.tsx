import { Button, Eyebrow, Fingerprint } from '../components/ui';

export function Onboarding({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="flex h-full flex-col px-6 pb-8 pt-10 animate-riseIn">
      <div className="flex items-center gap-2">
        <Fingerprint size={26} />
        <img src="/brand/logo-horizontal.svg" alt="e-Demokracija" className="h-5" />
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <div className="mb-7 flex justify-center">
          <div className="grid h-28 w-28 place-items-center rounded-card bg-orange/10">
            <Fingerprint size={72} />
          </div>
        </div>
        <Eyebrow>Digitalna demokracija</Eyebrow>
        <h1 className="mt-2 text-[2.5rem] leading-[0.98]">
          Vaš glas.
          <br />
          Vaša odluka.
        </h1>
        <p className="mt-4 text-[0.98rem] leading-relaxed text-muted">
          Novčanik zajednice za <span className="font-semibold text-navy-ink">donacije</span> i{' '}
          <span className="font-semibold text-navy-ink">članarine</span>. Bez kartica, bez seed-a — samo
          otisak prsta. Svaka uplata javno vidljiva.
        </p>
      </div>

      <div className="space-y-3">
        <Button full onClick={onEnter}>
          Otvori novčanik
        </Button>
        <p className="text-center text-xs leading-relaxed text-muted">
          Identitet čuva Face ID i Apple Keychain.
          <br />
          Udruga e-Demokracija · OIB 70011366813
        </p>
      </div>
    </div>
  );
}
