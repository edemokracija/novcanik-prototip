// Feedback članova UO — boje po osobi + dohvat komentara.
export type Comment = { id: string; name: string; screen: string; where?: string; comment: string; ts: number };

export const MEMBERS = ['Robert', 'Saša', 'Tomo', 'Kruno'];

export type FbColor = { accent: string; tint: string };

// Svaka osoba = zasebna boja (čitljivo na svijetloj pozadini).
const PALETTE: Record<string, FbColor> = {
  Robert: { accent: '#2563eb', tint: 'rgba(37,99,235,0.10)' }, // plava
  'Saša': { accent: '#16a34a', tint: 'rgba(22,163,74,0.10)' }, // zelena
  Tomo: { accent: '#7c3aed', tint: 'rgba(124,58,237,0.10)' }, // ljubičasta
  Kruno: { accent: '#db2777', tint: 'rgba(219,39,127,0.10)' }, // magenta
};
const DEFAULT: FbColor = { accent: '#64748b', tint: 'rgba(100,116,139,0.10)' };

export function colorFor(name: string): FbColor {
  return PALETTE[name] ?? DEFAULT;
}

export async function fetchComments(): Promise<Comment[]> {
  const r = await fetch('/api/feedback');
  const d = (await r.json()) as { items?: Comment[] };
  return d.items ?? [];
}
