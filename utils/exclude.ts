export default function exclude<Obj, Key extends keyof Obj>(
  object: Obj,
  keys: Key[]
): Omit<Obj, Key> {
  for (let key of keys) {
    delete object[key];
  }
  return object;
}
