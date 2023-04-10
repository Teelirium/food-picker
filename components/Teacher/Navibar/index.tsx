import Link from 'next/link';
import router from 'next/router';

import styles from './styles.module.scss';

type Props = {
  grade: string;
  selectedPage: string;
  teacherFio: string;
};

const Navibar: React.FC<Props> = ({ grade, selectedPage, teacherFio }) => {
  const selectPage = (pageName: string) => {
    if (pageName !== selectedPage)
      router.replace({ pathname: '', query: { ...router.query, page: pageName } }, undefined, {
        shallow: true,
      });
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.gradeBtn}
        onClick={() =>
          router.replace(
            {
              pathname: '',
              query: { ...router.query, isModalOpen: 1 },
            },
            undefined,
            { shallow: true },
          )
        }
      >
        <img src="/img/burgerIcon.png" alt="burgerIcon" className={styles.burgerIcon} />
        <div className={styles.grade}>{grade}</div>
      </div>
      <div className={styles.pages}>
        <div
          className={selectedPage === 'attendance' ? styles.activePage : styles.inactivePage}
          onClick={() => selectPage('attendance')}
        >
          Присутствие
        </div>
        <div
          className={selectedPage === 'debt' ? styles.activePage : styles.inactivePage}
          onClick={() => selectPage('debt')}
        >
          Задолженности
        </div>
      </div>
      <div className={styles.teacherFio}>{teacherFio}</div>
    </div>
  );
};

export default Navibar;
