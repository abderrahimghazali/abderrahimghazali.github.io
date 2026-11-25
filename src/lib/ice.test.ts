import { describe, expect, it } from 'vitest';
import { checkBulk, checkIce, formatIce, requiredKey, toCsv } from './ice';

describe('ICE key', () => {
  it.each(['003976749000084', '002136093000040', '001512572000078', '001561191000066'])('accepts %s', (n) => {
    expect(checkIce(n).valid).toBe(true);
  });

  it('rejects 002876543000091 and names the key the first 13 digits require', () => {
    const c = checkIce('002876543000091');
    expect(c.valid).toBe(false);
    expect(c.keyState).toBe('ko');
    expect(c.expectedKey).toBe('75');
    expect(BigInt('002876543000091') % 97n).toBe(16n);
  });

  it('computes the required key from the first 13 digits', () => {
    expect(requiredKey('0039767490000')).toBe('84');
    expect(requiredKey('0021360930000')).toBe('40');
    expect(requiredKey('0015125720000')).toBe('78');
  });

  it('handles spaces, no-break spaces and groups', () => {
    expect(checkIce('003976749 0000 84').valid).toBe(true);
    expect(checkIce(' 00 21 36 09 30 00 040 ').valid).toBe(true);
    expect(checkIce('003976749 0000 84').valid).toBe(true);
  });

  it('reports length and other characters', () => {
    const short = checkIce('3976749000084');
    expect(short.lengthState).toBe('ko');
    expect(short.length).toBe(13);
    expect(short.keyState).toBe('na');
    expect(checkIce('00397674900008A').hasOtherChars).toBe(true);
    expect(checkIce('').empty).toBe(true);
  });

  it('decomposes a 15-digit number', () => {
    expect(checkIce('003976749000084').structure).toEqual({ company: '003976749', establishment: '0000', key: '84' });
    expect(formatIce('003976749000084')).toBe('003976749 0000 84');
  });

  it('never uses floating point on the 15 digits', () => {
    // 2^53 is below 10^15, so a Number-based modulo would be unsafe.
    expect(checkIce('999999999999999').keyState).toBe('ko');
  });
});

describe('bulk', () => {
  it('skips blank lines, caps at 500 and exports CSV', () => {
    const text = ['003976749000084', '', '  ', '002876543000091', '123'].join('\n');
    const { rows, truncated } = checkBulk(text);
    expect(rows).toHaveLength(3);
    expect(truncated).toBe(false);
    expect(rows[0]?.comment).toBe('Format valide');
    expect(rows[1]?.comment).toBe('Clé attendue : 75');
    expect(rows[2]?.comment).toBe('3 chiffres au lieu de 15');
    expect(toCsv(rows).split('\n')).toHaveLength(4);
    expect(checkBulk(Array(600).fill('003976749000084').join('\n')).truncated).toBe(true);
  });
});
