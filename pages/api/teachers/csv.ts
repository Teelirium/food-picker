import { GradeInfo } from 'modules/grade/types';
import { TeacherService } from 'modules/teacher/service';
import { TeacherCreateForm } from 'modules/teacher/types';
import { FullName } from 'modules/user/types';
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

  const teachers = parsedCsv.slice(1).map((el) => {
    const [surname, name, middleName, gradeNum, letter, breakIndex] = el;

    const fullName = {
      surname,
      name,
      middleName: middleName || null,
    } satisfies FullName;
    const { randUsername, randPassword } = getRandomCredentials(fullName, 12);

    const teacher = {
      ...fullName,
      username: randUsername,
      password: randPassword,
    } satisfies TeacherCreateForm;

    const grade = {
      number: parseInt(gradeNum, 10),
      letter,
      breakIndex: parseInt(breakIndex, 10) - 1,
    } satisfies GradeInfo;

    return { ...teacher, ...grade };
  });

  // await TeacherService.createMany(teachers);

  const respData = CsvUtils.serialize(teachers);
  res.setHeader('Content-Disposition', 'attachment; filename="workers.csv"');
  res.setHeader('Content-Type', 'text/csv');
  res.write(respData);
  return res.end();
});
