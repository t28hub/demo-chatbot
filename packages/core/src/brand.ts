// Generic branding helper for nominal typing. `Brand<string, 'UUID'>` is a string
// that is not interchangeable with a plain string or with other brands, even
// though it carries no runtime overhead.
declare const brand: unique symbol;

export type Brand<T, B extends string> = T & { readonly [brand]: B };
