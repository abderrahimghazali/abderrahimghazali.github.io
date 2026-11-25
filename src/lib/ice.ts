// ICE (Identifiant Commun de l'Entreprise) form check: 15 digits whose full value is divisible by 97.
// The rule is the one applied by python-stdnum (stdnum.ma.ice); no official specification of the key was found.
// This checks the form of the number only. It says nothing about whether a company exists or is active.

export type CheckState = 'ok' | 'ko' | 'na';

export interface IceCheck {
  /** What the user typed, trimmed. */
  input: string;
  /** Digits only, once spaces are removed. Empty when other characters are present. */
  digits: string;
  hasOtherChars: boolean;
  length: number;
  lengthState: CheckState;
  structure: { company: string; establishment: string; key: string } | null;
  structureState: CheckState;
  keyState: CheckState;
  /** Key the first 13 digits would require, when the key is wrong. "00 ou 97" when both close the sum. */
  expectedKey: string | null;
  /** True only when the three checks pass. */
  valid: boolean;
  empty: boolean;
}

/** Spaces, no-break spaces and narrow no-break spaces are separators; anything else that is not a digit is flagged. */
const SEPARATORS = /[\s  ]/g;

export function isKeyConsistent(fifteenDigits: string): boolean {
  return BigInt(fifteenDigits) % 97n === 0n;
}

/** Key (two digits) required by the first 13 digits: 97 minus ((first 13 digits x 100) mod 97). 00 and 97 both give a multiple of 97 when the remainder is 0. */
export function requiredKey(thirteenDigits: string): string {
  const r = Number((BigInt(thirteenDigits) * 100n) % 97n);
  return r === 0 ? '00 ou 97' : String(97 - r).padStart(2, '0');
}

export function formatIce(digits: string): string {
  return /^\d{15}$/.test(digits) ? `${digits.slice(0, 9)} ${digits.slice(9, 13)} ${digits.slice(13)}` : digits;
}

export function checkIce(raw: string): IceCheck {
  const input = raw.trim();
  const compact = input.replace(SEPARATORS, '');
  const hasOtherChars = /\D/.test(compact);
  const digits = hasOtherChars ? '' : compact;
  const length = hasOtherChars ? compact.replace(/\D/g, '').length : compact.length;
  const lengthOk = !hasOtherChars && length === 15;

  const structure = lengthOk ? { company: digits.slice(0, 9), establishment: digits.slice(9, 13), key: digits.slice(13) } : null;
  const keyOk = lengthOk ? isKeyConsistent(digits) : false;
  return {
    input,
    digits,
    hasOtherChars,
    length,
    lengthState: input === '' ? 'na' : lengthOk ? 'ok' : 'ko',
    structure,
    structureState: lengthOk ? 'ok' : 'na',
    keyState: lengthOk ? (keyOk ? 'ok' : 'ko') : 'na',
    expectedKey: lengthOk && !keyOk ? requiredKey(digits.slice(0, 13)) : null,
    valid: lengthOk && keyOk,
    empty: input === '',
  };
}

export interface BulkRow {
  number: string;
  format: string;
  key: string;
  comment: string;
}

export function checkBulk(text: string, max = 500): { rows: BulkRow[]; truncated: boolean } {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const rows = lines.slice(0, max).map((line): BulkRow => {
    const c = checkIce(line);
    if (c.hasOtherChars) return { number: line, format: 'Non', key: 'Non évaluée', comment: 'Caractères autres que des chiffres' };
    if (c.lengthState !== 'ok') return { number: line, format: 'Non', key: 'Non évaluée', comment: `${c.length} chiffres au lieu de 15` };
    return c.valid
      ? { number: c.digits, format: 'Oui', key: 'Cohérente', comment: 'Format valide' }
      : { number: c.digits, format: 'Oui', key: 'Incohérente', comment: `Clé attendue : ${c.expectedKey}` };
  });
  return { rows, truncated: lines.length > max };
}

const csvCell = (v: string) => (/[;"\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

/** Semicolon-separated, which French spreadsheets open directly. */
export function toCsv(rows: BulkRow[]): string {
  return ['numéro;format;clé;commentaire', ...rows.map((r) => [r.number, r.format, r.key, r.comment].map(csvCell).join(';'))].join('\n');
}
