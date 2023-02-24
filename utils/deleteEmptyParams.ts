/* eslint-disable no-param-reassign, no-restricted-syntax */
import { ParsedUrlQuery } from 'querystring';

export default function deleteEmptyParams(query: ParsedUrlQuery) {
  for (const param in query) {
    if (query[param] === undefined) {
      delete query[param];
    }
  }
  return query;
}
