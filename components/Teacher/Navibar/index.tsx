import Link from 'next/link';
import router from 'next/router';

import styles from './styles.module.scss';

type Props = {
  grade: string;
  selectedPage: string;
  teacherFio: string;
};

const Navibar: React.FC<Props> = ({ grade, selectedPage, teacherFio }) => {
  return (
    <div className={styles.container}>
      <div className={styles.gradeBtn}>
        <img src="/img/burgerIcon.png" alt="burgerIcon" />
        <div className={styles.grade}>{grade}</div>
      </div>
      <div className={styles.pages}>
        <div className={selectedPage === 'attendance' ? styles.activePage : styles.inactivePage}>
          Присутствие
        </div>
        <div className={selectedPage === 'dept' ? styles.activePage : styles.inactivePage}>
          Задолженности
        </div>
      </div>
      <div className={styles.teacherFio}>{teacherFio}</div>
    </div>
  );
};

export default Navibar;
