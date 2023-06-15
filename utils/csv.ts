import { createReadStream } from 'fs';
import * as readline from 'node:readline';

import { TRPCError } from '@trpc/server';
import DetectFileEncodingAndLanguage from 'detect-file-encoding-and-language';
import formidable from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import * as Papa from 'papaparse';

import { getServerSessionWithOpts } from './getServerSession';
import verifyRole from './verifyRole';

export const CsvUtils = {
  readCsvFile(filepath: string) {
    return new Promise<string[]>((resolve, reject) => {
      const arr: string[] = [];

      try {
        const outStream = createReadStream(filepath, { encoding: 'utf-8' });

        const rl = readline.createInterface({ input: outStream, crlfDelay: Infinity });
        rl.on('line', (data) => {
          arr.push(data);
        });
        rl.on('close', () => {
          resolve(arr);
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  parse(csv: string[]): string[][] {
    const parsed = csv.map((line) => Papa.parse<string[]>(line).data).flat();
    return parsed;
  },

  serialize<T>(obj: T[]): string {
    const csv = Papa.unparse(obj);
    return csv;
  },

  /**
   * @throws {TRPCError}
   */
  async extractAdminCsv(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSessionWithOpts({ req, res });
    if (!session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    if (!verifyRole(session, ['ADMIN'])) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    if (req.method !== 'POST') {
      throw new TRPCError({ code: 'METHOD_NOT_SUPPORTED' });
    }

    const files = await parseFiles(req);
    const csvFile = files.csv as formidable.File | undefined;
    if (!csvFile) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Не найден файл в поле формы `csv`' });
    }
    console.log('Saved CSV file at', csvFile.filepath);

    const encoding = await DetectFileEncodingAndLanguage(csvFile.filepath);
    if (encoding.encoding !== 'UTF-8') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Кодировка файла должна быть `utf-8`',
      });
    }
    const data = await CsvUtils.readCsvFile(csvFile.filepath);
    const parsed = CsvUtils.parse(data);
    return parsed;
  },
};

function parseFiles(req: NextApiRequest) {
  const form = new formidable.IncomingForm({ keepExtensions: true });
  return new Promise<formidable.Files>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve(files);
    });
  });
}
