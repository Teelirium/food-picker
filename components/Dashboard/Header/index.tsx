import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './styles.module.scss';

type Props = {
  backUrl?: string;
  children: React.ReactNode;
};

const DashboardHeader: React.FC<Props> = ({ children, backUrl }) => {
  const router = useRouter();
  return (
    <header className={styles.header}>
      {backUrl ? (
        <Link href={backUrl}>
          <span>&lt;</span>
        </Link>
      ) : (
        <button type="button" onClick={() => router.back()}>
          <span>&lt;</span>
        </button>
      )}
      {children}
    </header>
  );
};

export default DashboardHeader;
