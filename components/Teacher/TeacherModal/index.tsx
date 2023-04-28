import { Grade } from '@prisma/client';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import ModalWrapper from 'components/ModalWrapper';
import deleteEmptyParams from 'utils/deleteEmptyParams';

import LogoutButton from 'components/LogoutButton';
import GradeItem from './GradeItem';
import styles from './styles.module.scss';

type Props = {
  gradeId: number | undefined;
  grades: Grade[];
};

const TeacherModal: React.FC<Props> = ({ gradeId, grades }) => {
  const router = useRouter();
  const toggle = useCallback(() => {
    router.replace(
      {
        pathname: '',
        query: deleteEmptyParams({ ...router.query, isModalOpen: undefined }),
      },
      undefined,
    );
  }, [router]);

  return (
    <ModalWrapper toggle={toggle}>
      <div className={styles.container}>
        <fieldset>
          <legend>Класс</legend>
          <div className={styles.grades}>
            {grades.map((grade) => (
              <GradeItem
                key={grade.id}
                grade={grade}
                isActive={gradeId === grade.id}
                toggle={toggle}
              />
            ))}
          </div>
          <LogoutButton />
        </fieldset>
      </div>
    </ModalWrapper>
  );
};

export default TeacherModal;
