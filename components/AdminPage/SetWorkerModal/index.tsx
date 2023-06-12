import { FC } from 'react';
import { Teacher, Worker } from '@prisma/client';
import { useForm } from 'react-hook-form';

import { ModalMethod } from 'utils/schemas/modalMethodSchema';
import ModalWrapper from 'components/ModalWrapper';

import styles from './styles.module.scss';

interface Props {
  method: ModalMethod;
  person?: Worker | Teacher;
  personType: 'worker' | 'teacher';
  close: () => void;
}

type TForm = {
  name: string;
  surname: string;
  middleName: string | null;
  username: string;
  newPassword: string;
  newPasswordRepeat: string;
};

const SetWorkerModal: FC<Props> = ({ method, person, personType, close }) => {
  const { register, handleSubmit } = useForm<TForm>({
    defaultValues: { surname: person?.surname, name: person?.name, middleName: person?.middleName },
  });

  const onSubmit = handleSubmit((values: TForm) => {
    console.log(values);
  });

  const onDelete = (personId?: number) => {
    console.log(personId);
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

            <span>Новый пароль:</span>
            <div className={styles.inputBorder}>
              <input type="text" className={styles.formInput} {...register('newPassword')} />
            </div>

            <span>Повторите пароль:</span>
            <div className={styles.inputBorder}>
              <input type="text" className={styles.formInput} {...register('newPasswordRepeat')} />
            </div>
          </div>

          <div className={styles.formBtns}>
            <div className={styles.cancelBtn} onClick={close}>
              Отмена
            </div>
            {method === 'UPDATE' ? (
              <div className={styles.removeBtn} onClick={() => onDelete(person?.id)}>
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

export default SetWorkerModal;
