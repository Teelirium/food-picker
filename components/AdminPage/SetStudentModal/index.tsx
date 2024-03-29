import { FC } from 'react';
import { Grade, Student } from '@prisma/client';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import toast from 'react-hot-toast';

import { ModalMethod } from 'utils/schemas/modalMethodSchema';
import ModalWrapper from 'components/ModalWrapper';
import optionFinder from 'utils/selectOptionFinder';
import { trpc } from 'utils/trpc/client';

import styles from './styles.module.scss';
import Icon from 'components/Icon';

interface Props {
  method: ModalMethod;
  student?: Student;
  close: () => void;
  grades: Grade[];
  onChangeStudent: () => void;
}

type TForm = {
  name: string;
  surname: string;
  middleName: string | null;
  gradeId: number;
};

const SetStudentModal: FC<Props> = ({ method, student, close, grades, onChangeStudent }) => {
  const { register, handleSubmit, control } = useForm<TForm>({
    defaultValues: {
      surname: student?.surname,
      name: student?.name,
      middleName: student?.middleName,
      gradeId: student?.gradeId || undefined,
    },
  });

  const createStudentMutation = trpc.students.create.useMutation({
    onError: () => toast.error('При создании ученика возникла ошибка'),
    onSuccess: () => {
      toast.success('Ученик успешно создан');
      onChangeStudent();
      close();
    },
  });
  const updateStudentMutation = trpc.students.update.useMutation({
    onError: () => toast.error('При обновлении данных ученика возникла ошибка'),
    onSuccess: () => {
      toast.success('Ученик успешно сохранен');
      onChangeStudent();
      close();
    },
  });
  const deleteStudentMutation = trpc.students.delete.useMutation({
    onError: () => toast.error('Не удалось удалить ученика'),
    onSuccess: () => {
      toast.success('Ученик успешно удален');
      onChangeStudent();
      close();
    },
  });

  const onSubmit = handleSubmit((values: TForm) => {
    if (method === 'POST') {
      createStudentMutation.mutate(values);
    }

    if (method === 'UPDATE' && student) {
      updateStudentMutation.mutate({ ...values, id: student.id });
    }
  });

  const onDelete = (studentId: number) => {
    deleteStudentMutation.mutate({ id: studentId });
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
            {method === 'POST' ? 'Добавление' : 'Редактирование'} ученика
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
            <div className={styles.inputBorder}>
              <Controller
                name="gradeId"
                control={control}
                render={({ field }) => (
                  <Select
                    options={gradeOptions}
                    value={optionFinder(gradeOptions, field.value)}
                    onChange={(val: any) => field.onChange(val?.value)}
                    ref={field.ref}
                    placeholder="Класс"
                    classNamePrefix="setStudentSelect"
                    className={styles.setStudentSelect}
                  />
                )}
              />
            </div>
          </div>

          <div className={styles.formBtns}>
            {method === 'UPDATE' && student ? (
              <div className={styles.removeBtn} onClick={() => onDelete(student.id)}>
                <Icon.Trash />
                Удалить
              </div>
            ) : null}
            <div className={styles.cancelBtn} onClick={close}>
              Отмена
            </div>
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
