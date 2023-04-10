import { signOut } from 'next-auth/react';

import styles from './styles.module.scss';

const LogoutButton: React.FC = () => {
  return (
    <button className={styles.button} onClick={() => signOut()} type="button">
      Выйти из аккаунта
    </button>
  );
};

export default LogoutButton;
