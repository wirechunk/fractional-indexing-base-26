export declare const digits = "abcdefghijklmnopqrstuvwxyz";
/**
 * Returns the key that is halfway between the two given keys, which are expected to have the format that this library produces.
 * If both a and b are non-null, a must sort lexicographically before b.
 */
export declare function generateKeyBetween(a: string | null, b: string | null): string;
/**
 * Returns an array of n distinct keys in sorted order.
 * If a and b are both null, keys start at the middle of the possible key range, so it returns [na, nb, ...].
 * If only a is null, returns the "integer" key immediately before b.
 * If only b is null, returns the "integer" key immediately after a.
 * Otherwise, returns (short) keys strictly between a and b.
 */
export declare function generateKeysBetween(a: string | null, b: string | null, n: number): string[];
