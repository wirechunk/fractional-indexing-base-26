// License: CC0 (no rights reserved).
// This is based on https://observablehq.com/@dgreensp/implementing-fractional-indexing
export const digits = 'abcdefghijklmnopqrstuvwxyz';
const zero = digits[0];
const integerZero = 'na';
const smallestInteger = 'a' + digits[0].repeat(13);
// `a` may be an empty string, `b` is null or a non-empty string.
// `a < b` lexicographically if `b` is non-null.
// No trailing zeros are allowed.
function midpoint(a, b) {
    if (b !== null && a >= b) {
        throw new Error(a + ' >= ' + b);
    }
    if (a.slice(-1) === zero || b?.slice(-1) === zero) {
        throw new Error('trailing zero');
    }
    if (b) {
        // Remove longest common prefix. Pad `a` with zeroes as we go.
        // Note that we don't need to pad `b` because it can't
        // end before `a` while traversing the common prefix.
        let n = 0;
        while ((a[n] || zero) === b[n]) {
            n++;
        }
        if (n > 0) {
            return b.slice(0, n) + midpoint(a.slice(n), b.slice(n));
        }
    }
    // The first digits (or lack of digit) are different.
    const digitA = a ? digits.indexOf(a[0]) : 0;
    const digitB = b !== null ? digits.indexOf(b[0]) : digits.length;
    if (digitB - digitA > 1) {
        const midDigit = Math.round(0.5 * (digitA + digitB));
        return digits[midDigit];
    }
    // The first digits are consecutive.
    if (b && b.length > 1) {
        return b.slice(0, 1);
    }
    // `b` is null or has length 1 (a single digit).
    // the first digit of `a` is the previous digit to `b`,
    // or 9 if `b` is null.
    // given, for example, midpoint('49', '5'), return
    // '4' + midpoint('9', null), which will become
    // '4' + '9' + midpoint('', null), which is '495'
    return digits[digitA] + midpoint(a.slice(1), null);
}
const getIntegerLength = (head) => {
    if (head >= 'a' && head <= 'm') {
        // We add 2 because there's the header and there's always at least one digit after the header.
        return 'm'.charCodeAt(0) - head.charCodeAt(0) + 2;
    }
    if (head >= 'n' && head <= 'z') {
        return head.charCodeAt(0) - 'n'.charCodeAt(0) + 2;
    }
    throw new Error('invalid order key head: ' + head);
};
function validateInteger(int) {
    if (int.length !== getIntegerLength(int[0])) {
        throw new Error('invalid integer part of order key: ' + int);
    }
}
const getIntegerPart = (key) => key.slice(0, getIntegerLength(key[0]));
// Note that this may return null, as there is a largest integer.
const incrementInteger = (x) => {
    validateInteger(x);
    const [head, ...digs] = x.split('');
    let carry = true;
    for (let i = digs.length - 1; carry && i >= 0; i--) {
        const d = digits.indexOf(digs[i]) + 1;
        if (d === digits.length) {
            digs[i] = zero;
        }
        else {
            digs[i] = digits[d];
            carry = false;
        }
    }
    if (carry) {
        if (head === 'm') {
            return 'n' + zero;
        }
        if (head === 'z') {
            return null;
        }
        const newHead = String.fromCharCode(head.charCodeAt(0) + 1);
        if (newHead > 'n') {
            return newHead + digs.join('') + zero;
        }
        digs.pop();
        return newHead + digs.join('');
    }
    return head + digs.join('');
};
const z = digits.slice(-1);
// Note that this may return null, as there is a smallest integer.
const decrementInteger = (x) => {
    validateInteger(x);
    const [head, ...digs] = x.split('');
    let borrow = true;
    for (let i = digs.length - 1; borrow && i >= 0; i--) {
        const d = digits.indexOf(digs[i]) - 1;
        if (d === -1) {
            digs[i] = z;
        }
        else {
            digs[i] = digits[d];
            borrow = false;
        }
    }
    if (borrow) {
        if (head === 'n') {
            return 'm' + z;
        }
        if (head === 'a') {
            return null;
        }
        const newHead = String.fromCharCode(head.charCodeAt(0) - 1);
        if (newHead < 'm') {
            return newHead + digs.join('') + z;
        }
        digs.pop();
        return newHead + digs.join('');
    }
    return head + digs.join('');
};
/**
 * Returns the key that is halfway between the two given keys, which are expected to have the format that this library produces.
 * If both a and b are non-null, a must sort lexicographically before b.
 */
export function generateKeyBetween(a, b) {
    if (a !== null && b !== null && a >= b) {
        throw new Error(`expected ${a} >= ${b}`);
    }
    if (a === null) {
        if (b === null) {
            return integerZero;
        }
        const bIntegerPart = getIntegerPart(b);
        const bFractionPart = b.slice(bIntegerPart.length);
        if (bIntegerPart === smallestInteger) {
            return bIntegerPart + midpoint('', bFractionPart);
        }
        if (bIntegerPart < b) {
            return bIntegerPart;
        }
        const res = decrementInteger(bIntegerPart);
        if (res == null) {
            throw new Error('cannot decrement any more');
        }
        return res;
    }
    const aIntegerPart = getIntegerPart(a);
    const aFractionPart = a.slice(aIntegerPart.length);
    if (b === null) {
        const nextInteger = incrementInteger(aIntegerPart);
        return nextInteger === null ? aIntegerPart + midpoint(aFractionPart, null) : nextInteger;
    }
    const bIntegerPart = getIntegerPart(b);
    const bFractionPart = b.slice(bIntegerPart.length);
    if (aIntegerPart === bIntegerPart) {
        return aIntegerPart + midpoint(aFractionPart, bFractionPart);
    }
    const nextInteger = incrementInteger(aIntegerPart);
    if (nextInteger === null) {
        throw new Error('cannot increment any more');
    }
    if (nextInteger < b) {
        return nextInteger;
    }
    return aIntegerPart + midpoint(aFractionPart, null);
}
/**
 * Returns an array of n distinct keys in sorted order.
 * If a and b are both null, keys start at the middle of the possible key range, so it returns [na, nb, ...].
 * If only a is null, returns the "integer" key immediately before b.
 * If only b is null, returns the "integer" key immediately after a.
 * Otherwise, returns (short) keys strictly between a and b.
 */
export function generateKeysBetween(a, b, n) {
    if (n === 0) {
        return [];
    }
    if (n === 1) {
        return [generateKeyBetween(a, b)];
    }
    if (b == null) {
        let c = generateKeyBetween(a, b);
        const result = [c];
        for (let i = 0; i < n - 1; i++) {
            c = generateKeyBetween(c, b);
            result.push(c);
        }
        return result;
    }
    if (a === null) {
        let c = generateKeyBetween(a, b);
        const result = [c];
        for (let i = 0; i < n - 1; i++) {
            c = generateKeyBetween(a, c);
            result.push(c);
        }
        result.reverse();
        return result;
    }
    const mid = Math.floor(n / 2);
    const c = generateKeyBetween(a, b);
    return [...generateKeysBetween(a, c, mid), c, ...generateKeysBetween(c, b, n - mid - 1)];
}
