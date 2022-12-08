import Link from "next/link";
import styles from "./styles.module.scss";

type Props = {
  children: React.ReactNode;
};

const DashboardHeader: React.FC<Props> = ({ children }) => {
  return (
    <header className={styles.header}>
      <Link href='javascript:history.back()'>
        <span>&lt;</span>
      </Link>
      {children}
    </header>
  );
};

export default DashboardHeader;
