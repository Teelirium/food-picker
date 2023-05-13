export default function deleteEmptyParams<T>(query: { [k: string]: T | undefined }) {
  const result = Object.fromEntries(
    Object.entries(query).filter((tuple): tuple is [string, T] => tuple[1] !== undefined),
  );
  return result;
}
