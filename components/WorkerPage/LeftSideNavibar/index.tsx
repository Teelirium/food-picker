import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

import styles from './styles.module.css';

const LeftSideNavibar = ({ activePage }: { activePage: number }) => {
  const [isLogoutVisible, setLogoutVisible] = useState(false);

  const logOut = () => {
    signOut();
  };

  return (
    <div className={styles.navibar}>
      <div className={styles.workerName}>
        <span>Иванов Иван Иванович</span>
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

      <nav className={styles.nav}>
        <Link href="dishes">
          <div
            className={
              activePage === 1
                ? `${styles.navElement} ${styles.activeNavElement}`
                : styles.navElement
            }
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
        </Link>
        <Link href="orders">
          <div
            className={
              activePage === 2
                ? `${styles.navElement} ${styles.activeNavElement}`
                : styles.navElement
            }
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
        </Link>
        <Link href="standard-menu">
          <div
            className={
              activePage === 3
                ? `${styles.navElement} ${styles.activeNavElement}`
                : styles.navElement
            }
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
        </Link>
      </nav>
    </div>
  );
};

export default LeftSideNavibar;
