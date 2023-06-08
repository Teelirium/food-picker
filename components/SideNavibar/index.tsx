import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

import { adminItems, workerItems } from 'utils/sideNavibarItems';

import NavElement from './NavElement';
import styles from './styles.module.css';

type Props = {
  activePage: number;
  workerName: string;
};

const LeftSideNavibar: React.FC<Props> = ({ activePage, workerName }) => {
  const [isLogoutVisible, setLogoutVisible] = useState(false);
  const session = useSession({ required: true });
  const items = session.data?.user.role === 'ADMIN' ? adminItems : workerItems;
  const tabsList = items.map((item, index) => {
    return (
      <NavElement
        key={item.route}
        title={item.title}
        route={item.route}
        logoUrl={index === activePage ? item.activeLogoUrl : item.inactiveLogoUrl}
        isActive={index === activePage}
      />
    );
  });

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

      <div className={styles.nav}>{tabsList}</div>
    </div>
  );
};

export default LeftSideNavibar;
