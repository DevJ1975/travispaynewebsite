import type { Data } from '@measured/puck';

/** A blank Puck document for a newly created page. */
export function emptyPuckData(): Data {
  return { content: [], root: {}, zones: {} };
}
