import { FC } from 'react';
import { Grade, Teacher, Worker } from '@prisma/client';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { ModalMethod } from 'utils/schemas/modalMethodSchema';
import ModalWrapper from 'components/ModalWrapper';
import { trpc } from 'utils/trpc/client';

import styles from './styles.module.scss';

interface Props {
  method: ModalMethod;
  person?: Omit<Worker, 'password'> | Omit<Teacher & { Grades: Grade[] }, 'password'>;
  personType: 'worker' | 'teacher';
  close: () => void;
  onChangeWorker: () => void;
}

type TForm = {
  name: string;
  surname: string;
  middleName: string | null;
  username: string;
  password: string;
};

const SetWorkerModal: FC<Props> = ({ method, person, personType, close, onChangeWorker }) => {
  const { register, handleSubmit } = useForm<TForm>({
    defaultValues: { surname: person?.surname, name: person?.name, middleName: person?.middleName },
  });

  const createTeacherMutation = trpc.teachers.create.useMutation({
    onError: () => toast.error('При создании учителя возникла ошибка'),
    onSuccess: () => {
      toast.success('Учитель успешно создан');
      onChangeWorker();
      close();
    },
  });
  const updateTeacherMutation = trpc.teachers.update.useMutation({
    onError: () => toast.error('При обновлении данных учителя возникла ошибка'),
    onSuccess: () => {
      toast.success('Учитель успешно сохранен');
      onChangeWorker();
      close();
    },
  });
  const deleteTeacherMutation = trpc.teachers.delete.useMutation({
    onError: () => toast.error('Не удалось удалить учителя'),
    onSuccess: () => {
      toast.success('Учитель успешно удален');
      onChangeWorker();
      close();
    },
  });

  const createWorkerMutation = trpc.workers.create.useMutation({
    onError: () => toast.error('При создании повара возникла ошибка'),
    onSuccess: () => {
      toast.success('Повар успешно создан');
      onChangeWorker();
      close();
    },
  });
  const updateWorkerMutation = trpc.workers.update.useMutation({
    onError: () => toast.error('При обновлении данных повара возникла ошибка'),
    onSuccess: () => {
      toast.success('Повар успешно сохранен');
      onChangeWorker();
      close();
    },
  });
  const deleteWorkerMutation = trpc.workers.delete.useMutation({
    onError: () => toast.error('Не удалось удалить повара'),
    onSuccess: () => {
      toast.success('Повар успешно удален');
      onChangeWorker();
      close();
    },
  });

  const onSubmit = handleSubmit((values: TForm) => {
    if (method === 'POST') {
      if (personType === 'teacher') {
        createTeacherMutation.mutate(values);
      } else {
        createWorkerMutation.mutate({ role: 'WORKER', ...values });
      }
    }

    if (method === 'UPDATE' && person) {
      if (personType === 'teacher') {
        updateTeacherMutation.mutate({ ...values, id: person.id, username: person.username });
      } else {
        updateWorkerMutation.mutate({
          ...values,
          id: person.id,
          username: person.username,
          role: 'WORKER',
        });
      }
    }
  });

  const onDelete = (personId: number) => {
    if (personType === 'teacher') {
      deleteTeacherMutation.mutate({ id: personId });
    } else {
      deleteWorkerMutation.mutate({ id: personId });
    }
  };

  const header = (() => {
    const operationText = method === 'POST' ? 'Добавление' : 'Редактирование';
    const personTypeText = personType === 'worker' ? 'работника' : 'учителя';
    return `${operationText} профиля ${personTypeText}`;
  })();

  return (
    <ModalWrapper toggle={close}>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.header}>
            {header}
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

            <span>Логин:</span>
            {person ? (
              <div className={styles.formUsername}>{person.username}</div>
            ) : (
              <div className={styles.inputBorder}>
                <input type="text" className={styles.formInput} {...register('username')} />
              </div>
            )}

            <span>{method === 'POST' ? 'Пароль:' : 'Новый пароль:'}</span>
            <div className={styles.inputBorder}>
              <input type="text" className={styles.formInput} {...register('password')} />
            </div>
          </div>

          <div className={styles.formBtns}>
            <div className={styles.cancelBtn} onClick={close}>
              Отмена
            </div>
            {method === 'UPDATE' && person ? (
              <div className={styles.removeBtn} onClick={() => onDelete(person.id)}>
                Удалить
              </div>
            ) : null}
            <button className={styles.submitBtn} type="submit">
              {method === 'POST' ? 'Создать' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default SetWorkerModal;
