import { Student } from '@prisma/client';
import axios from 'axios';
import dayjs from 'dayjs';
import Image from 'next/image';
import { FC } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { useMutation } from 'react-query';

import useWindowSize from 'hooks/useWindowSize';
import magnifierIcon from 'public/svg/magnifier.svg';
import { getFullName, getInitials } from 'utils/names';

import styles from './styles.module.scss';

interface DebtListProps {
  gradeId: number;
  students: Student[];
}

type TForm = {
  search: string;
  debt: Record<number, number>;
};

const DebtList: FC<DebtListProps> = ({ gradeId, students }) => {
  const date = dayjs();

  const defaultDebts = Object.fromEntries(students.map(({ id, debt }) => [id, debt]));

  const methods = useForm<TForm>({
    defaultValues: { debt: defaultDebts },
  });
  const { register, handleSubmit, setValue, watch, control } = methods;
  const search = watch('search') || '';

  const filteredStudents = students.filter((student) =>
    student.surname.toLowerCase().includes(search.toLowerCase()),
  );

  const onSubmit = (data: TForm) => {
    console.log(data);
    // saveMutation.mutate(data.presence);
  };

  const windowSize = useWindowSize();

  // const saveMutation = useMutation({
  //   mutationFn: (updatedPresence: Record<number, boolean>) => {
  //     const studentPresentList = Object.entries(updatedPresence)
  //       .filter(([, isPresent]) => isPresent)
  //       .map(([id]) => +id);
  //     return axios.put(
  //       '/api/students/presence',
  //       { students: studentPresentList },
  //       { params: { gradeId, date: date.toDate() } },
  //     );
  //   },
  // });

  return (
    <form className={styles.content} onSubmit={handleSubmit(onSubmit)}>
      <FormProvider {...methods}>
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

        <div className={styles.studentList}>
          {filteredStudents.map((student) => (
            <div className={styles.student} key={student.id}>
              <div className={styles.studentName}>
                {(windowSize.width || 0) < 450 ? getInitials(student) : getFullName(student)}
              </div>
              <div className={styles.studentDebt}>
                <Controller
                  render={({ field: { ref, value, onChange, onBlur } }) => (
                    <NumericFormat
                      thousandSeparator=" "
                      decimalScale={0}
                      onValueChange={(v) => onChange(v.floatValue || null)}
                      value={value}
                      getInputRef={ref}
                      onBlur={onBlur}
                      className={styles.studentDebtInput}
                    />
                  )}
                  name={`debt.${student.id}` as any}
                  control={control}
                />
                <div className={styles.studentDebtCurrency}>₽</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.date}>{date.format('DD.MM.YYYY')}</div>
          <button type="submit" className={styles.saveButton}>
            Сохранить
          </button>
        </div>
      </FormProvider>
    </form>
  );
};

export default DebtList;
