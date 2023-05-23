import router from 'next/router';
import styles from './styles.module.scss';
import { FC } from 'react';

type Props = {
  title: string;
  logoUrl: string;
  route: string;
  isActive: boolean;
};

const NavElement: FC<Props> = ({ title, logoUrl, route, isActive }) => {
  return (
    <div
      className={isActive ? styles.activeNavElement : styles.navElement}
      onClick={() => router.push(route)}
    >
      <img src={logoUrl} alt={title} width={25} height={25} className={styles.navElementImg} />
      <span>{title}</span>
    </div>
  );
};

export default NavElement;
