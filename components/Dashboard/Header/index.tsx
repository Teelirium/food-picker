import Link from 'next/link';

import styles from './styles.module.scss';

type Props = {
  backUrl?: string;
  children: React.ReactNode;
};

const DashboardHeader: React.FC<Props> = ({ children, backUrl }) => (
  <header className={styles.header}>
    {/* eslint-disable-next-line no-script-url */}
    <Link href={backUrl || 'javascript:history.back()'}>
      <span>&lt;</span>
    </Link>
    {children}
  </header>
);

export default DashboardHeader;
