/* eslint-disable no-param-reassign, no-restricted-syntax */
export default function exclude<Obj, Key extends keyof Obj>(
  object: Obj,
  keys: Key[],
): Omit<Obj, Key> {
  for (const key of keys) {
    delete object[key];
  }
  return object;
}
