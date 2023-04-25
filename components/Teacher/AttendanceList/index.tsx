import { Student, StudentPresence } from '@prisma/client';
import axios from 'axios';
import dayjs from 'dayjs';
import Image from 'next/image';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';

import Checkbox from 'components/Checkbox';
import useWindowSize from 'hooks/useWindowSize';
import magnifierIcon from 'public/svg/magnifier.svg';
import personsIcon from 'public/svg/persons.svg';
import { getFullName, getInitials } from 'utils/names';

import styles from './styles.module.scss';

interface AttendanceListProps {
  gradeId: number;
  presenceList: StudentPresence[];
  students: Student[];
}

type TForm = {
  search: string;
  presence: Record<number, boolean>;
};

const AttendanceList: FC<AttendanceListProps> = ({ gradeId, presenceList, students }) => {
  const date = dayjs();

  const defaultPresenceSet = new Set(presenceList.map(({ studentId }) => studentId));
  const defaultPresence = students.reduce((acc: Record<number, boolean>, { id }) => {
    acc[id] = defaultPresenceSet.has(id);
    return acc;
  }, {});

  const { register, handleSubmit, setValue, watch } = useForm<TForm>({
    defaultValues: { presence: defaultPresence },
  });
  const search = watch('search') || '';
  const presence = watch('presence') || {};

  const presenceCount = Object.entries(presence)
    .map(([, isPresent]) => isPresent)
    .reduce((acc, isPresent) => (isPresent ? acc + 1 : acc), 0);

  const filteredStudents = students.filter((student) =>
    student.surname.toLowerCase().includes(search.toLowerCase()),
  );

  const onSubmit = (data: TForm) => {
    saveMutation.mutate(data.presence);
  };

  const selectAll = () => {
    students.forEach(({ id }) => {
      setValue(`presence.${id}` as any, true);
    });
  };

  const windowSize = useWindowSize();

  const saveMutation = useMutation({
    mutationFn: (updatedPresence: Record<number, boolean>) => {
      const studentPresentList = Object.entries(updatedPresence)
        .filter(([, isPresent]) => isPresent)
        .map(([id]) => +id);
      return axios.put(
        '/api/students/presence',
        { students: studentPresentList },
        { params: { gradeId, date: date.toDate() } },
      );
    },
  });

  return (
    <form className={styles.content} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.formActions}>
        <button type="button" className={styles.selectAllButton} onClick={selectAll}>
          Выбрать всё
        </button>
        <label className={styles.searchLineWrapper}>
          <input
            type="text"
            className={styles.searchLineInput}
            placeholder="Поиск (по фамилии)"
            {...register('search')}
          />
          <div className={styles.searchLineIcon}>
            <Image src={magnifierIcon} alt="" />
          </div>
        </label>
      </div>

      <div className={styles.studentList}>
        {filteredStudents.map((student) => (
          <Checkbox
            className={styles.checkbox}
            {...register(`presence.${student.id}` as any)}
            key={student.id}
          >
            {(windowSize.width || 0) < 450 ? getInitials(student) : getFullName(student)}
          </Checkbox>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.date}>{date.format('DD.MM.YYYY')}</div>
        <button type="submit" className={styles.saveButton}>
          <span>Сохранить</span>
          <span>–</span>
          <span className={styles.saveButtonNumber}>
            {presenceCount}
            <Image className={styles.saveButtonSvg} src={personsIcon} alt="" />
          </span>
        </button>
      </div>
    </form>
  );
};

export default AttendanceList;
