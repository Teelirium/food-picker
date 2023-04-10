import { useRouter } from 'next/router';

import styles from './styles.module.scss';
import { Grade } from '@prisma/client';
import deleteEmptyParams from 'utils/deleteEmptyParams';

type Props = {
  grade: Grade;
  isActive: boolean;
  toggle: () => void;
};

const GradeItem: React.FC<Props> = ({ grade, isActive, toggle }) => {
  const router = useRouter();
  function click() {
    if (isActive) toggle();
    else
      router.replace(
        {
          pathname: '',
          query: deleteEmptyParams({ ...router.query, isModalOpen: undefined, gradeId: grade.id }),
        },
        undefined,
      );
  }

  return (
    <div className={isActive ? styles.active : styles.grade} onClick={() => click()}>
      {`${grade.number} ${grade.letter}`}
    </div>
  );
};

export default GradeItem;
