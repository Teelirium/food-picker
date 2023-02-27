import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import styles from './styles.module.css';
import router from 'next/router';

type Props = {
  activePage: number;
  workerName: string;
};

const LeftSideNavibar: React.FC<Props> = ({ activePage, workerName }) => {
  const [isLogoutVisible, setLogoutVisible] = useState(false);

  const logOut = () => {
    signOut();
  };

  return (
    <div className={styles.navibar}>
      <div className={styles.workerName}>
        <span>{workerName}</span>
        <label className={styles.checkboxLabel}>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={isLogoutVisible}
            onChange={() => setLogoutVisible(!isLogoutVisible)}
          />
          <span className={styles.customCheckbox} />
        </label>
      </div>
      <div className={isLogoutVisible ? styles.logoutBtn : styles.hide} onClick={() => logOut()}>
        Выйти из аккаунта
      </div>

      <div className={styles.nav}>
        <div
          className={
            activePage === 1 ? `${styles.navElement} ${styles.activeNavElement}` : styles.navElement
          }
          onClick={() => router.push('dishes')}
        >
          <img
            src={activePage === 1 ? '/img/activeDishes.png' : '/img/dishes.png'}
            alt="dishes"
            width={25}
            height={25}
            className={styles.navElementImg}
          />
          <span>Блюда</span>
        </div>
        <div
          className={
            activePage === 2 ? `${styles.navElement} ${styles.activeNavElement}` : styles.navElement
          }
          onClick={() => router.push('orders')}
        >
          <img
            src={activePage === 2 ? '/img/activeOrders.png' : '/img/orders.png'}
            alt="orders"
            width={25}
            height={25}
            className={styles.navElementImg}
          />
          <span>Заказы</span>
        </div>
        <div
          className={
            activePage === 3 ? `${styles.navElement} ${styles.activeNavElement}` : styles.navElement
          }
          onClick={() => router.push('standard-menu')}
        >
          <img
            src={activePage === 3 ? '/img/activeStandardMenu.png' : '/img/standardMenu.png'}
            alt="standardMenu"
            width={25}
            height={25}
            className={styles.navElementImg}
          />
          <span>Стандартное питание</span>
        </div>
      </div>
    </div>
  );
};

export default LeftSideNavibar;
