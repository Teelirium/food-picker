import { FC } from 'react';
import { Grade, Student } from '@prisma/client';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';

import { ModalMethod } from 'utils/schemas/modalMethodSchema';
import ModalWrapper from 'components/ModalWrapper';
import optionFinder from 'utils/selectOptionFinder';

import styles from './styles.module.scss';

interface Props {
  method: ModalMethod;
  student?: Student;
  close: () => void;
  grades: Grade[];
}

type TForm = {
  name: string;
  surname: string;
  middleName: string | null;
  gradeId: number | null;
};

const SetStudentModal: FC<Props> = ({ method, student, close, grades }) => {
  const { register, handleSubmit, control } = useForm<TForm>({
    defaultValues: {
      surname: student?.surname,
      name: student?.name,
      middleName: student?.middleName,
      gradeId: student?.gradeId,
    },
  });

  const onSubmit = handleSubmit((values: TForm) => {
    console.log(values);
  });

  const onDelete = (personId?: number) => {
    console.log(personId);
  };

  const gradeOptions = grades.map((grade) => ({
    label: `${grade.number} ${grade.letter}`,
    value: grade.id,
  }));

  return (
    <ModalWrapper toggle={close}>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.header}>
            {method === 'POST' ? 'Добавление' : 'Редактирование'} профиля ученика
            <div className={styles.closeBtn} onClick={close}>
              <img src="/img/close.png" alt="close" width={20} height={20} />
            </div>
          </div>

          <div className={styles.formGrid}>
            <span>Фамилия:</span>
            <div className={styles.inputBorder}>
              <input type="text" className={styles.formInput} {...register('surname')} />
            </div>

            <span>Имя:</span>
            <div className={styles.inputBorder}>
              <input type="text" className={styles.formInput} {...register('name')} />
            </div>

            <span>Отчество:</span>
            <div className={styles.inputBorder}>
              <input type="text" className={styles.formInput} {...register('middleName')} />
            </div>

            <span>Класс:</span>
            <Controller
              name="gradeId"
              control={control}
              render={({ field }) => (
                <Select
                  options={gradeOptions}
                  value={optionFinder(gradeOptions, field.value)}
                  onChange={(val: any) => field.onChange(val?.value)}
                  ref={field.ref}
                />
              )}
            />
          </div>

          <div className={styles.formBtns}>
            <div className={styles.cancelBtn} onClick={close}>
              Отмена
            </div>
            {method === 'UPDATE' ? (
              <div className={styles.removeBtn} onClick={() => onDelete(student?.id)}>
                Удалить
              </div>
            ) : null}
            <button className={styles.submitBtn} type="submit">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default SetStudentModal;
