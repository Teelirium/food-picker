import Link from 'next/link';
import { useRouter } from 'next/router';

import { ChevronLeftIcon } from 'components/ui/Icons';
import styles from './styles.module.scss';

type Props = {
  backUrl?: string;
  children: React.ReactNode;
};

const DashboardHeader: React.FC<Props> = ({ children, backUrl }) => {
  const router = useRouter();
  return (
    <header className={styles.header}>
      <button
        type="button"
        onClick={() => (backUrl ? router.push(backUrl) : router.back())}
        className={styles.icon}
      >
        <ChevronLeftIcon />
      </button>
      {children}
    </header>
  );
};

export default DashboardHeader;
