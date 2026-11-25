import { describe, expect, it } from 'vitest';
import { build } from './invoice-form';
import { mixed, sample } from './invoice-samples';

describe('invoice builder', () => {
  it('computes the sample with decimals, not floats', () => {
    const b = build(sample);
    expect(b.totals.totalNet).toBe('10750.00');
    expect(b.totals.totalVat).toBe('2150.00');
    expect(b.totals.totalGross).toBe('12900.00');
    expect(b.words).toBe('douze mille neuf cents dirhams');
    expect(b.xml).toContain('<cbc:PayableAmount currencyID="MAD">12900.00</cbc:PayableAmount>');
  });

  it('breaks VAT down by rate with a discount and a 0 % line', () => {
    const b = build(mixed);
    expect(b.totals.breakdown.map((x) => x.rate)).toEqual(['20', '10', '0']);
    expect(b.totals.lines[0]?.net).toBe('3375.00');
    expect(b.totals.lines[1]?.net).toBe('1001.06');
  });

  it('escapes XML special characters', () => {
    const b = build({ ...sample, seller: { ...sample.seller, name: 'A & B <C>' } });
    expect(b.xml).toContain('A &amp; B &lt;C&gt;');
  });
});
