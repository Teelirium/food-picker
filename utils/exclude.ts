/**
 * tfw this is recommended by prisma
 * https://www.prisma.io/docs/concepts/components/prisma-client/excluding-fields
 */
export default function exclude<Obj, Key extends keyof Obj>(
  object: Obj,
  keys: Key[],
): Omit<Obj, Key> {
  for (const key of keys) {
    delete object[key];
  }
  return object;
}
