// Čitljivi nazivi ekrana — dijeljeno između feedback widgeta i pregleda komentara.
export const SCREEN_LABELS: Record<string, string> = {
  onboarding: 'Onboarding',
  home: 'Početna',
  doniraj: 'Doniraj',
  clanarina: 'Članarina',
  projekti: 'Projekti',
  nagrade: 'Nagrade · edEUR',
  aktivnost: 'Aktivnost',
  primi: 'Primi',
  glasovanje: 'Glasovanje',
};

export const screenLabel = (s: string) => SCREEN_LABELS[s] ?? s;
