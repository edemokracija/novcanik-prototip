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

// ── Članarina: dvije kategorije ────────────────────────────────────────────
// Redovni član: 1 €/tjedno. Član upravnog odbora (UO): 3 €/dan.
// `owed` = nepodmirena razdoblja unatrag (mock).
export type TierKey = 'redovni' | 'uo';
export const tiers: Record<
  TierKey,
  {
    key: TierKey;
    label: string;
    rate: number;
    adverb: string; // "tjedno" | "dnevno"
    unit: [string, string, string]; // hrvatska množina: 1 / 2-4 / 5+
    periodDays: number;
    presets: number[];
    owed: number; // neplaćena razdoblja unatrag
  }
> = {
  redovni: {
    key: 'redovni',
    label: 'Redovni član',
    rate: 1,
    adverb: 'tjedno',
    unit: ['tjedan', 'tjedna', 'tjedana'],
    periodDays: 7,
    presets: [4, 12, 52],
    owed: 0,
  },
  uo: {
    key: 'uo',
    label: 'Upravni odbor',
    rate: 3,
    adverb: 'dnevno',
    unit: ['dan', 'dana', 'dana'],
    periodDays: 1,
    presets: [7, 30, 90],
    owed: 3,
  },
};

/** Hrvatska množina po zadnjoj znamenki (1 tjedan / 2-4 tjedna / 5+ tjedana). */
export function plural(n: number, forms: [string, string, string]) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return forms[0];
  if (m10 >= 2 && m10 <= 4 && !(m100 >= 12 && m100 <= 14)) return forms[1];
  return forms[2];
}

// ── Namjenski računi / projekti (interna crowdfunding platforma) ───────────
// Svaki projekt = zaseban namjenski Safe (transparentan, auditabilan). Član
// usmjerava svoju članarinu na projekte po izboru — ili u Opći fond.
export type Project = {
  id: string;
  name: string;
  desc: string;
  raised: number;
  goal: number;
  contributors: number;
  address: string;
  central?: boolean;
};
export const projects: Project[] = [
  {
    id: 'opci',
    name: 'Opći fond udruge',
    desc: 'Osnovni rad, administracija i troškovi udruge',
    raised: 1820,
    goal: 3000,
    contributors: 112,
    address: '0x0pć…A1c',
    central: true,
  },
  {
    id: 'agora',
    name: 'Platforma Agora',
    desc: 'Razvoj platforme za sudjelovanje građana',
    raised: 3220,
    goal: 5000,
    contributors: 88,
    address: '0xA90r…7C4',
  },
  {
    id: 'pravna',
    name: 'Pravna analiza referenduma',
    desc: 'Pravni okvir za građanski referendum u RH',
    raised: 840,
    goal: 1500,
    contributors: 41,
    address: '0xPr4v…9D2',
  },
  {
    id: 'edu',
    name: 'Edukacija građana',
    desc: 'Radionice, materijali i kampanje',
    raised: 610,
    goal: 2000,
    contributors: 33,
    address: '0xEdu…2B7',
  },
];

// ── edEUR: interni loyalty stablecoin (potvrda rada) ───────────────────────
// Ne-prenosiv (soulbound) — izdaje samo udruga kao potvrdu rada; iz fonda za
// isplate može se zamijeniti za EURe. Bez P2P → izvan EMT/EMI okvira.
export const loyalty = {
  balance: 24, // edEUR
  fundAvailable: 1250, // EURe dostupno u fondu za isplate
  log: [
    { id: 'r1', label: 'Moderiranje rasprave na Agori', amount: 5, when: 'pet, 18:30' },
    { id: 'r2', label: 'Prijevod dokumenata', amount: 8, when: 'sri, 12:10' },
    { id: 'r3', label: 'Prisustvo sjednici UO', amount: 3, when: 'pon, 19:00' },
    { id: 'r4', label: 'Doprinos · 8 tjedana po 30 min', amount: 8, when: 'tijekom mjeseca' },
  ],
};
export const edeur = (n: number) => `${n} edEUR`;

export const dmy = (d: Date) =>
  new Intl.DateTimeFormat('hr-HR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
