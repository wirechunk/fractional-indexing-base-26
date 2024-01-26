# Fractional Indexing

This is based on [Implementing Fractional Indexing
](https://observablehq.com/@dgreensp/implementing-fractional-indexing) by [David Greenspan
](https://github.com/dgreensp).

Fractional indexing is a technique to create an ordering that can be used for [Realtime Editing of Ordered Sequences](https://www.figma.com/blog/realtime-editing-of-ordered-sequences/).

This implementation includes variable-length integers and the prepend/append optimization described in David's article.

## Install

```sh
npm i fractional-indexing-base-26
```

This package is available on npm as [fractional-indexing-base-26](https://www.npmjs.com/package/fractional-indexing-base-26).

## API

### `generateKeyBetween`

Generate a single key in between two points.

```ts
generateKeyBetween(
  a: string | null, // start
  b: string | null, // end
): string;
```

```ts
import { generateKeyBetween } from 'fractional-indexing-base-26';

const first = generateKeyBetween(null, null); // "na"

// Insert after 1st
const second = generateKeyBetween(first, null); // "nb"

// Insert after 2nd
const third = generateKeyBetween(second, null); // "nc"

// Insert before 1st
const zeroth = generateKeyBetween(null, first); // "mz"

// Insert in between 2nd and 3rd (midpoint)
const secondAndHalf = generateKeyBetween(second, third); // "nbn"
```

### `generateKeysBetween`

Use this when generating multiple keys at some known position, as it spaces out indexes more evenly and leads to shorter keys.

```ts
generateKeysBetween(
  a: string | null | undefined, // start
  b: string | null | undefined, // end
  n: number, // number of keys to generate between start and end
): string[];
```

```ts
import { generateKeysBetween } from 'fractional-indexing-base-26';

const first = generateKeysBetween(null, null, 2); // ['na', 'nb']

// Insert two keys after 2nd
generateKeysBetween('na', null, 2); // ['nb', 'nc']

// Insert three keys before 1st
generateKeysBetween(null, 'na', 3); // ['mx', 'my', 'mz']

// Insert two keys in between two keys
generateKeysBetween('na', 'nb', 2); // ['nah', 'nan']
```
