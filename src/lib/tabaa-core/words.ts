// Copied from https://github.com/abderrahimghazali/tabaa (packages/core). Fixes go there first, then here.
// French only: the Arabic half of words.ts is not vendored.
import { Decimal } from "decimal.js";

const FR_UNITS = [
  "zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix",
  "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf",
];
const FR_TENS = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante"];

// `final`: nothing numeric follows, so "quatre-vingts" and "cents" take their s.
function frBelow100(n: number, final: boolean): string {
  if (n < 20) return FR_UNITS[n]!;
  if (n >= 80) {
    if (n === 80) return final ? "quatre-vingts" : "quatre-vingt";
    return `quatre-vingt-${frBelow100(n - 80, final)}`;
  }
  const tens = Math.floor(n / 10);
  const unit = n % 10;
  if (tens >= 7) {
    const rest = n - 60;
    return rest === 11 ? "soixante et onze" : `soixante-${FR_UNITS[rest]}`;
  }
  if (unit === 0) return FR_TENS[tens]!;
  if (unit === 1) return `${FR_TENS[tens]} et un`;
  return `${FR_TENS[tens]}-${FR_UNITS[unit]}`;
}

function frBelow1000(n: number, final: boolean): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  if (h === 0) return frBelow100(r, final);
  const hundreds = h === 1 ? "cent" : `${FR_UNITS[h]} cent${r === 0 && final ? "s" : ""}`;
  return r === 0 ? hundreds : `${hundreds} ${frBelow100(r, final)}`;
}

function frInteger(n: number): string {
  if (n === 0) return "zéro";
  const scales: [number, string][] = [[1e9, "milliard"], [1e6, "million"]];
  const parts: string[] = [];
  let rest = n;
  for (const [size, name] of scales) {
    const g = Math.floor(rest / size);
    rest %= size;
    if (g > 0) parts.push(`${frBelow1000(g, true)} ${name}${g > 1 ? "s" : ""}`);
  }
  const thousands = Math.floor(rest / 1000);
  rest %= 1000;
  if (thousands === 1) parts.push("mille");
  else if (thousands > 1) parts.push(`${frBelow1000(thousands, false)} mille`);
  if (rest > 0) parts.push(frBelow1000(rest, true));
  return parts.join(" ");
}

function frUnit(n: number, word: string): string {
  return `${frInteger(n)} ${word}${n > 1 ? "s" : ""}`;
}

/** Amount in dirhams and centimes, spelled out. `amount` is a decimal string. */
export function amountInWords(amount: string): string {
  const value = new Decimal(amount).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const negative = value.isNegative() && !value.isZero();
  const abs = value.abs();
  const dirhams = abs.trunc().toNumber();
  const centimes = abs.minus(abs.trunc()).times(100).toNumber();

  const dirhamPart =
    dirhams === 0
      ? "zéro dirham"
      : dirhams % 1_000_000 === 0
        ? `${frInteger(dirhams)} de dirhams`
        : frUnit(dirhams, "dirham");
  const text = centimes === 0 ? dirhamPart : `${dirhamPart} et ${frUnit(centimes, "centime")}`;
  return negative ? `moins ${text}` : text;
}
