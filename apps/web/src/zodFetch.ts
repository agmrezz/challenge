import type { ZodTypeAny, z } from 'zod';

export type ResponseWithData<TSchema extends ZodTypeAny = ZodTypeAny> =
  Response & {
    data?: z.infer<TSchema>;
  };

/**
 * A wrapper for fetch that enabled type-safe fetching with zod schemas
 *
 * @param {TSchema} schema - A Zod schema to validate the response against
 * @param {RequestInfo | URL} input - The first argument to the fetch method, normally a URL, but any object with `toString()` is accepted.
 * @param {RequestInit | undefined} init - Options to forward to the fetch method.
 *
 */
export async function zodFetch<TSchema extends ZodTypeAny>(
  schema: TSchema, // infer the type from passed in schema
  input: RequestInfo | URL,
  init?: RequestInit | undefined
): Promise<ResponseWithData<TSchema>> {
  const response: ResponseWithData<TSchema> = await fetch(input, init);
  if (response.ok) {
    const data = await response.json();
    response.data = schema.parse(data);

    return response;
  }

  throw new Error('Failed to fetch');
}
