import { describe, expect, test } from 'vitest';

import { generateKeyBetween, generateKeysBetween } from './lib.js';

describe('generateKeyBetween', () => {
  test.each([
    { a: null, b: null, expected: 'na' },
    { a: null, b: 'na', expected: 'mz' },
    { a: null, b: 'mz', expected: 'my' },
    { a: 'mz', b: null, expected: 'na' },
    { a: 'na', b: null, expected: 'nb' },
    { a: 'ma', b: null, expected: 'mb' },
    { a: 'na', b: 'nb', expected: 'nan' },
    { a: 'accccccccccccc', b: 'accccccccccccd', expected: 'acccccccccccccn' },
    { a: 'mz', b: 'na', expected: 'mzn' },
    { a: 'mz', b: 'nb', expected: 'na' },
    { a: null, b: 'laa', expected: 'kzzz' },
    { a: 'nz', b: null, expected: 'oaa' },
    { a: 'nf', b: 'ng', expected: 'nfn' },
    { a: 'prrr', b: 'prrs', expected: 'prrrn' },
    { a: 'kfff', b: 'kffg', expected: 'kfffn' },
    { a: 'mz', b: 'nan', expected: 'na' },
    { a: 'na', b: 'nan', expected: 'nah' },
    { a: 'nah', b: 'nan', expected: 'nak' },
    { a: 'zzzzzzzzzzzzzy', b: null, expected: 'zzzzzzzzzzzzzz' },
    { a: 'zzzzzzzzzzzzzz', b: null, expected: 'zzzzzzzzzzzzzzn' },
  ])('$a, $b', ({ a, b, expected }) => {
    expect(generateKeyBetween(a, b)).toBe(expected);
  });

  test('invalid order key head', () => {
    expect(() => generateKeyBetween('0', '1')).toThrow('invalid order key head: 0');
  });

  test('a == b', () => {
    expect(() => generateKeyBetween('na', 'na')).toThrow('expected na >= na');
  });

  test('a > b', () => {
    expect(() => generateKeyBetween('nb', 'na')).toThrow('expected nb >= na');
  });
});

describe('generateKeysBetween', () => {
  test('null, null, 5', () => {
    expect(generateKeysBetween(null, null, 5)).toEqual(['na', 'nb', 'nc', 'nd', 'ne']);
  });

  test('null, null, 0', () => {
    expect(generateKeysBetween(null, null, 0)).toEqual([]);
  });

  test('"na", null, 10', () => {
    expect(generateKeysBetween('na', null, 10)).toEqual([
      'nb',
      'nc',
      'nd',
      'ne',
      'nf',
      'ng',
      'nh',
      'ni',
      'nj',
      'nk',
    ]);
  });

  test('null, "na", 5', () => {
    expect(generateKeysBetween(null, 'na', 5)).toEqual(['mv', 'mw', 'mx', 'my', 'mz']);
  });

  test('"na", "nb", 27', () => {
    expect(generateKeysBetween('na', 'nb', 27)).toEqual([
      'nab',
      'nac',
      'nad',
      'nae',
      'naf',
      'nag',
      'nah',
      'nai',
      'naj',
      'najn',
      'nak',
      'nal',
      'nam',
      'nan',
      'nao',
      'nap',
      'naq',
      'nar',
      'nas',
      'nat',
      'nau',
      'nav',
      'naw',
      'nawn',
      'nax',
      'nay',
      'naz',
    ]);
  });
});
