import { FC } from 'react';
import { Grade, Student, Teacher } from '@prisma/client';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { NumericFormat } from 'react-number-format';

import { ModalMethod } from 'utils/schemas/modalMethodSchema';
import ModalWrapper from 'components/ModalWrapper';
import optionFinder from 'utils/selectOptionFinder';
import { trpc } from 'utils/trpc/client';
import { getFullName } from 'utils/names';

import styles from './styles.module.scss';

interface Props {
  method: ModalMethod;
  grade?: Grade & {
    teacher: {
      surname: string;
      name: string;
      id: number;
      middleName: string | null;
    };
    students: Student[];
  };
  teachers: Omit<Teacher & { Grades: Grade[] }, 'password'>[];
  close: () => void;
  onChangeGrade: () => void;
}

type TForm = {
  number: number;
  letter: string;
  breakIndex: number;
  teacherId: number;
};

const SetClassModal: FC<Props> = ({ method, grade, teachers, close, onChangeGrade }) => {
  const { register, handleSubmit, control } = useForm<TForm>({
    defaultValues: {
      number: grade?.number,
      letter: grade?.letter,
      teacherId: grade?.teacherId,
      breakIndex: grade?.breakIndex,
    },
  });

  const createGradeMutation = trpc.grades.create.useMutation({
    onError: () => toast.error('При создании класса возникла ошибка'),
    onSuccess: () => {
      toast.success('Класс успешно создан');
      onChangeGrade();
      close();
    },
  });
  const updateGradeMutation = trpc.grades.update.useMutation({
    onError: () => toast.error('При обновлении класса возникла ошибка'),
    onSuccess: () => {
      toast.success('Класс успешно сохранен');
      onChangeGrade();
      close();
    },
  });
  const deleteGradeMutation = trpc.grades.delete.useMutation({
    onError: () => toast.error('Не удалось удалить класс'),
    onSuccess: () => {
      toast.success('Класс успешно удален');
      onChangeGrade();
      close();
    },
  });

  const onSubmit = handleSubmit((values: TForm) => {
    if (method === 'POST') {
      createGradeMutation.mutate({
        ...values,
        studentIds: grade?.students.map(({ id }) => id) || [],
      });
    }

    if (method === 'UPDATE' && grade) {
      updateGradeMutation.mutate({
        ...values,
        id: grade.id,
        studentIds: grade?.students.map(({ id }) => id) || [],
      });
    }
  });

  const onDelete = (gradeId: number) => {
    deleteGradeMutation.mutate({ id: gradeId });
  };

  const teacherOptions = teachers.map((teacher) => ({
    label: getFullName(teacher),
    value: teacher.id,
  }));

  return (
    <ModalWrapper toggle={close}>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.header}>
            {method === 'POST' ? 'Добавление' : 'Редактирование'} класса
            <div className={styles.closeBtn} onClick={close}>
              <img src="/img/close.png" alt="close" width={20} height={20} />
            </div>
          </div>

          <div className={styles.formGrid}>
            <span>Номер:</span>
            <div className={styles.inputBorder}>
              <Controller
                render={({ field: { ref, value, onChange, onBlur } }) => (
                  <NumericFormat
                    allowNegative={false}
                    decimalScale={0}
                    onValueChange={(v) => onChange(v.floatValue)}
                    value={value}
                    getInputRef={ref}
                    onBlur={onBlur}
                    className={styles.formInput}
                  />
                )}
                name="number"
                control={control}
              />
            </div>

            <span>Литера:</span>
            <div className={styles.inputBorder}>
              <input type="text" className={styles.formInput} {...register('letter')} />
            </div>

            <span>Учитель:</span>
            <div className={styles.inputBorder}>
              <Controller
                name="teacherId"
                control={control}
                render={({ field }) => (
                  <Select
                    options={teacherOptions}
                    value={optionFinder(teacherOptions, field.value)}
                    onChange={(val: any) => field.onChange(val?.value)}
                    ref={field.ref}
                    placeholder="Учитель"
                  />
                )}
              />
            </div>

            <span>Обеденная перемена:</span>
            <div className={styles.inputBorder}>
              <Controller
                render={({ field: { ref, value, onChange, onBlur } }) => (
                  <NumericFormat
                    allowNegative={false}
                    decimalScale={0}
                    onValueChange={(v) => onChange(v.floatValue)}
                    value={value}
                    getInputRef={ref}
                    onBlur={onBlur}
                    className={styles.formInput}
                  />
                )}
                name="breakIndex"
                control={control}
              />
            </div>
          </div>

          <div className={styles.formBtns}>
            <div className={styles.cancelBtn} onClick={close}>
              Отмена
            </div>
            {method === 'UPDATE' && grade ? (
              <div className={styles.removeBtn} onClick={() => onDelete(grade.id)}>
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

export default SetClassModal;
