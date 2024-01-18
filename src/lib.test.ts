import { generateKeyBetween, generateKeysBetween } from './lib.js';

const test = (a: string | null, b: string | null, expected: string) => {
  let act: string;
  try {
    act = generateKeyBetween(a, b);
  } catch (e) {
    act = (e as Error).message;
  }

  console.assert(expected === act, `a: ${a}; b: ${b}; expected: ${expected}; actual: ${act}`);
};

test(null, null, 'na');
test(null, 'na', 'mz');
test(null, 'mz', 'my');
test('mz', null, 'na');
test('na', null, 'nb');
test('ma', null, 'mb');
test('na', 'nb', 'nan');
test('accccccccccccc', 'accccccccccccd', 'acccccccccccccn');
test('mz', 'na', 'mzn');
test('mz', 'nb', 'na');
test(null, 'laa', 'kzzz');
test('nz', null, 'oaa');
test('nf', 'ng', 'nfn');
test('prrr', 'prrs', 'prrrn');
test('kfff', 'kffg', 'kfffn');
test('mz', 'nan', 'na');
test('na', 'nan', 'nah');
test('nah', 'nan', 'nak');
test('zzzzzzzzzzzzzy', null, 'zzzzzzzzzzzzzz');
test('zzzzzzzzzzzzzz', null, 'zzzzzzzzzzzzzzn');
test('aaa', null, 'invalid integer part of order key: aaa');
test('0', '1', 'invalid order key head: 0');
test('nb', 'na', 'nb >= na');

const testN = (a: string | null, b: string | null, n: number, expected: string) => {
  let act: string;
  try {
    act = generateKeysBetween(a, b, n).join(' ');
  } catch (e) {
    act = (e as Error).message;
  }

  console.assert(expected === act, `${expected} === ${act}`);
};

testN(null, null, 5, 'na nb nc nd ne');
testN('na', null, 10, 'nb nc nd ne nf ng nh ni nj nk');
testN(null, 'na', 5, 'mv mw mx my mz');
testN(
  'na',
  'nb',
  20,
  'nab nac nae naf nag nah nai naj nak nam nan nao nap nar nat nau nav naw nax naz'
);
testN('na', 'nb', 27, 'nab nac nad nae naf nag nah nai naj najn nak nal nam nan nao nap naq nar nas nat nau nav naw nawn nax nay naz');
