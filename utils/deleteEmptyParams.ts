import { ParsedUrlQuery } from "querystring";

export default function deleteEmptyParams(query: ParsedUrlQuery) {
  for (let param in query) {
    if (query[param] === undefined) {
      delete query[param];
    }
  }
  return query;
}
