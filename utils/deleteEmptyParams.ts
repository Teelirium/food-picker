/* eslint-disable no-param-reassign, no-restricted-syntax */
export default function deleteEmptyParams<T>(query: { [k: string]: T | undefined }) {
  const result = Object.fromEntries(
    Object.entries(query).filter((tuple): tuple is [string, T] => tuple[1] !== undefined),
  );
  return result;
  // for (const param in query) {
  //   if (query[param] === undefined) {
  //     delete query[param];
  //   }
  // }
  // return query;
}
