/**
 * tfw this is recommended by prisma
 * https://www.prisma.io/docs/concepts/components/prisma-client/excluding-fields
 */
export default function exclude<Obj, Keys extends keyof Obj>(
  object: Obj,
  keys: Keys[],
): Omit<Obj, Keys> {
  const newObject = { ...object };
  return excludeMut(newObject, keys);
}

/**
 * Same as exclude except it mutates the given object
 */
export function excludeMut<Obj, Keys extends keyof Obj>(
  object: Obj,
  keys: Keys[],
): Omit<Obj, Keys> {
  for (const key of keys) {
    delete object[key];
  }
  return object;
}
