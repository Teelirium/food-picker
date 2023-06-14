import { createReadStream } from 'fs';

import { TRPCError } from '@trpc/server';
import formidable from 'formidable';

import withErrHandler from 'utils/errorUtils/withErrHandler';
import { getServerSessionWithOpts } from 'utils/getServerSession';
import verifyRole from 'utils/verifyRole';

export const config = {
  api: {
    bodyParser: false,
  },
};

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
      const form = new formidable.IncomingForm({ keepExtensions: true });

      const files = await new Promise<formidable.Files>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve(files);
        });
      });
      const { csv } = files as { csv: formidable.File };

      const outStream = createReadStream(csv.filepath, { encoding: 'utf-8' });
      outStream.on('data', (data) => {
        console.log(data);
      });
      res.end();
      return;
    }
    default:
      throw new TRPCError({ code: 'METHOD_NOT_SUPPORTED' });
  }
});
