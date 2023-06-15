import { FullName } from 'modules/user/types';
import { WorkerService } from 'modules/worker/service';
import { WorkerCreateForm } from 'modules/worker/types';
import { CsvUtils } from 'utils/csv';
import withErrHandler from 'utils/errorUtils/withErrHandler';
import { getRandomCredentials } from 'utils/randomUtils';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default withErrHandler(async (req, res) => {
  const parsedCsv = await CsvUtils.extractAdminCsv(req, res);

  const workers = parsedCsv.slice(1).map((el) => {
    const fullName = {
      surname: el[0],
      name: el[1],
      middleName: el[2] || null,
    } satisfies FullName;
    const { randPassword, randUsername } = getRandomCredentials(fullName, 12);
    const dto = {
      ...fullName,
      username: randUsername,
      password: randPassword,
      role: el[3] ? 'ADMIN' : 'WORKER',
    } satisfies WorkerCreateForm;
    return dto;
  });

  await WorkerService.createMany(workers);

  const respData = CsvUtils.serialize(workers);
  res.setHeader('Content-Disposition', 'attachment; filename="workers.csv"');
  res.setHeader('Content-Type', 'text/csv');
  res.write(respData);
  return res.end();
});
