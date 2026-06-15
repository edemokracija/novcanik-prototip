// Mock podaci za design prototip (Faza 1). Nema onchain logike — sve je lažno.
// U Fazi 3 ovo zamjenjuje funkcionalna jezgra iz pay.domovina.ai (git submodule).

export const eur = (n: number) =>
  new Intl.NumberFormat('hr-HR', { style: 'currency', currency: 'EUR' }).format(n);

export const account = {
  name: 'Moj novčanik',
  balance: 128.0,
  // skraćeni Safe address — samo za prikaz
  address: '0x449a…3FbF',
  membershipActive: true,
  weeklyDues: 1, // 1 € tjedno (Statut čl. 11)
  level: 'Tribun', // Glasnik → Tribun → Praeco → Orator
};

export const kindLabel: Record<'donacija' | 'clanarina' | 'primljeno', string> = {
  donacija: 'Donacija',
  clanarina: 'Članarina',
  primljeno: 'Primljeno',
};

export type Tx = {
  id: string;
  kind: 'donacija' | 'clanarina' | 'primljeno';
  // donatori su anonimni po defaultu (pseudonim), javno ime samo uz opt-in
  who: string;
  amount: number;
  when: string;
  recurring?: boolean;
};

// Transparentnost = #1 brand vrijednost: javni, auditabilni zapisnik.
export const ledger: Tx[] = [
  { id: 't1', kind: 'donacija', who: 'Andrej P33', amount: 30, when: 'danas, 09:12', recurring: true },
  { id: 't2', kind: 'clanarina', who: 'Moj novčanik', amount: 1, when: 'pon, 08:00', recurring: true },
  { id: 't3', kind: 'donacija', who: 'Marija K.', amount: 50, when: 'pet, 17:40' },
  { id: 't4', kind: 'donacija', who: 'Anonimni građanin', amount: 5, when: 'pet, 11:03' },
  { id: 't5', kind: 'primljeno', who: 'SEPA uplata', amount: 100, when: 'čet, 14:22' },
  { id: 't6', kind: 'donacija', who: 'Ivan T.', amount: 30, when: 'sri, 20:15', recurring: true },
  { id: 't7', kind: 'clanarina', who: 'Luka P12', amount: 1, when: 'pon, 08:00', recurring: true },
];

// Javni agregat zajednice (za "transparentnost" karticu)
export const community = {
  totalRaised: 4820,
  activeMembers: 137,
  goal: 6000,
  goalLabel: 'Infrastruktura platforme Agora',
};

export const donationPresets = [10, 30, 50];
