import { FC, Fragment, useState } from 'react';
import { Grade, Parent, ParentStudent, Student } from '@prisma/client';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { ModalMethod } from 'utils/schemas/modalMethodSchema';
import ModalWrapper from 'components/ModalWrapper';
import { trpc } from 'utils/trpc/client';
import { getFullName } from 'utils/names';
import Icon from 'components/Icon';
import useModal from 'hooks/useModal';

import FindStudentModal from '../FindStudentModal';

import styles from './styles.module.scss';

interface Props {
  method: ModalMethod;
  parent?: Omit<
    Parent & {
      parentStudent: (ParentStudent & {
        student: Student & {
          grade: Grade | null;
        };
      })[];
    },
    'password'
  >;
  close: () => void;
  students: (Student & { grade: Grade | null })[];
  onChangeParent: () => void;
}

type TForm = {
  name: string;
  surname: string;
  middleName: string | null;
  username: string;
  password: string;
};

const SetParentModal: FC<Props> = ({ method, parent, close, students, onChangeParent }) => {
  const [studentIds, setStudentIds] = useState<number[]>(
    parent?.parentStudent.map(({ studentId }) => studentId) || [],
  );

  const studentExplorerModal = useModal();

  const { register, handleSubmit } = useForm<TForm>({
    defaultValues: {
      surname: parent?.surname,
      name: parent?.name,
      middleName: parent?.middleName,
    },
  });

  const createParentMutation = trpc.parents.create.useMutation({
    onError: () => toast.error('При создании родителя возникла ошибка'),
    onSuccess: () => {
      toast.success('Родитель успешно создан');
      onChangeParent();
      close();
    },
  });
  const updateParentMutation = trpc.parents.update.useMutation({
    onError: () => toast.error('При обновлении данных родителя возникла ошибка'),
    onSuccess: () => {
      toast.success('Родитель успешно сохранен');
      onChangeParent();
      close();
    },
  });
  const deleteParentMutation = trpc.parents.delete.useMutation({
    onError: () => toast.error('Не удалось удалить родителя'),
    onSuccess: () => {
      toast.success('Родитель успешно удален');
      onChangeParent();
      close();
    },
  });

  const onSubmit = handleSubmit((values: TForm) => {
    if (method === 'POST') {
      createParentMutation.mutate({ ...values, studentIds });
    }

    if (method === 'UPDATE' && parent) {
      updateParentMutation.mutate({
        ...values,
        id: parent.id,
        username: parent.username,
        studentIds,
      });
    }
  });

  const deleteChild = (studentId: number) => {
    setStudentIds((studentIds) => studentIds.filter((id) => id !== studentId));
  };

  const onDelete = (studentId: number) => {
    deleteParentMutation.mutate({ id: studentId });
  };

  const addChild = (studentId: number) => {
    setStudentIds((studentIds) => [...studentIds, studentId]);
  };

  return (
    <>
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

              <span>Логин:</span>
              {parent ? (
                <div className={styles.formUsername}>{parent.username}</div>
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

            <div className={styles.children}>
              {studentIds.map((studentId, i) => {
                const student = students.find((student) => student.id === studentId);
                if (!student) return;

                return (
                  <Fragment key={studentId}>
                    <div className={styles.childNumber}>{i + 1}</div>
                    <div className={styles.childFullName}>{getFullName(student)}</div>
                    <div className={styles.childGrade}>
                      {student.grade?.number} {student.grade?.letter}
                    </div>
                    <div className={styles.childRemove}>
                      <button
                        type="button"
                        className={styles.childRemoveButton}
                        onClick={() => deleteChild(student.id)}
                      >
                        <Icon.Trash />
                      </button>
                    </div>
                  </Fragment>
                );
              })}
            </div>

            <button
              type="button"
              className={styles.addChildButton}
              onClick={studentExplorerModal.open}
            >
              Добавить ребенка
            </button>

            <div className={styles.formBtns}>
              <div className={styles.cancelBtn} onClick={close}>
                Отмена
              </div>
              {method === 'UPDATE' && parent ? (
                <div className={styles.removeBtn} onClick={() => onDelete(parent.id)}>
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

      {studentExplorerModal.isOpen && (
        <FindStudentModal
          close={studentExplorerModal.close}
          onChoose={addChild}
          students={students.filter((student) => !studentIds.includes(student.id)) || []}
        />
      )}
    </>
  );
};

export default SetParentModal;
