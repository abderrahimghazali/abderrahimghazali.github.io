import type { Level, Source, Step } from '../data/reforme';

const long = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const month = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' });

/** "2026" stays a year, "2026-11" becomes "novembre 2026", a full date becomes "25 novembre 2026". */
export function formatDate(iso: string): string {
  if (/^\d{4}$/.test(iso)) return iso;
  if (/^\d{4}-\d{2}$/.test(iso)) return month.format(new Date(`${iso}-01T00:00:00Z`));
  return long.format(new Date(`${iso}T00:00:00Z`));
}

export const titleMonth = (iso: string) => month.format(new Date(`${iso}T00:00:00Z`));

export const levelLabel: Record<Level, string> = {
  'en-vigueur': 'Texte en vigueur',
  annonce: 'Annoncé, rapporté par la presse',
  'non-confirme': 'Non confirmé',
};

export const stateLabel: Record<Step['state'], string> = {
  fait: 'Fait',
  rapporte: 'Rapporté par la presse',
  attente: 'En attente',
};

export const kindLabel: Record<Source['kind'], string> = {
  officiel: 'Officiel',
  presse: 'Presse',
  editeur: 'Éditeur de logiciels',
};
