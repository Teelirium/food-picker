import { createReadStream } from 'fs';
import * as readline from 'node:readline';

import { TRPCError } from '@trpc/server';
import DetectFileEncodingAndLanguage from 'detect-file-encoding-and-language';
import formidable from 'formidable';
import { NextApiRequest } from 'next';
import * as Papa from 'papaparse';
import { transliterate } from 'transliteration';

import { FullName } from 'modules/user/types';
import { WorkerService } from 'modules/worker/service';
import { WorkerCreateForm } from 'modules/worker/types';
import withErrHandler from 'utils/errorUtils/withErrHandler';
import { getServerSessionWithOpts } from 'utils/getServerSession';
import { getInitials } from 'utils/names';
import { getRandomPassword } from 'utils/randomUtils';
import verifyRole from 'utils/verifyRole';

export const config = {
  api: {
    bodyParser: false,
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

function readCsvFile(filepath: string) {
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
}

export default withErrHandler(async (req, res) => {
  const session = await getServerSessionWithOpts({ req, res });
  if (!session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  if (!verifyRole(session, ['ADMIN'])) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  switch (req.method) {
    case 'POST': {
      const files = await parseFiles(req);

      const csvFile = files.csv as formidable.File | undefined;
      if (!csvFile) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Не найден файл в поле `csv`' });
      }
      console.log(csvFile.filepath);

      const encoding = await DetectFileEncodingAndLanguage(csvFile.filepath);
      if (encoding.encoding !== 'UTF-8') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Кодировка файла должна быть `utf-8`',
        });
      }

      const data = await readCsvFile(csvFile.filepath);
      const parsed = data.map((line) => Papa.parse<string[]>(line).data).flat();
      const workers = parsed.slice(1).map((el) => {
        const fullName = {
          surname: el[0],
          name: el[1],
          middleName: el[2] || null,
        } satisfies FullName;
        const initals = getInitials(fullName).replaceAll(' ', '');
        const nums = 4;
        const randDiscriminator = Math.floor(
          Math.random() * (10 ** nums - 10 ** (nums - 1)) + 10 ** (nums - 1),
        );
        const randUsername = `${transliterate(initals)}-${randDiscriminator}`;
        const randPassword = getRandomPassword(10);
        const dto = {
          ...fullName,
          username: randUsername,
          password: randPassword,
          role: el[3] ? 'ADMIN' : 'WORKER',
        } satisfies WorkerCreateForm;
        return dto;
      });

      await WorkerService.createMany(workers);

      const respData = Papa.unparse(workers);
      res.setHeader('Content-disposition', 'attachment; filename=workers.csv');
      res.setHeader('Content-type', 'text/csv');
      res.write(respData);
      return res.end();
    }
    default:
      throw new TRPCError({ code: 'METHOD_NOT_SUPPORTED' });
  }
});
