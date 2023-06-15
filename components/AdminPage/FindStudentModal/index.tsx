import { FC } from 'react';
import { Grade, Student } from '@prisma/client';
import { useForm, useWatch } from 'react-hook-form';
import Image from 'next/image';

import ModalWrapper from 'components/ModalWrapper';
import magnifierIcon from 'public/svg/magnifier.svg';
import { getFullName } from 'utils/names';
import Table, { TColumn } from 'components/Table';

import styles from './styles.module.scss';

interface Props {
  close: () => void;
  students: (Student & { grade: Grade | null })[];
  onChoose: (studentId: number) => void;
}

type TForm = {
  search: string;
};

const FindStudentModal: FC<Props> = ({ close, students, onChoose }) => {
  const { register, control } = useForm<TForm>();
  const search = useWatch({ control, name: 'search' });

  const chooseStudent = (studentId: number) => {
    onChoose(studentId);
    close();
  };

  const filteredStudents = search
    ? students
        .filter((student) => student.surname.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 5)
    : [];

  const tableColumns: TColumn<Props['students'][number]>[] = [
    {
      key: 'fullName',
      title: 'ФИО',
      render: ({ record }) => getFullName(record),
    },
    {
      key: 'grade',
      title: 'Класс',
      render: ({ record: student }) => `${student.grade?.number} ${student.grade?.letter}`,
    },
  ];

  return (
    <ModalWrapper toggle={close}>
      <div className={styles.container}>
        <form className={styles.form}>
          <div className={styles.header}>
            Поиск ученика
            <div className={styles.closeBtn} onClick={close}>
              <img src="/img/close.png" alt="close" width={20} height={20} />
            </div>
          </div>

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

          <Table
            rowProps={{
              onClick: (student) => chooseStudent(student.id),
            }}
            columns={tableColumns}
            className={styles.table}
            data={filteredStudents}
          />
        </form>
      </div>
    </ModalWrapper>
  );
};

export default FindStudentModal;
