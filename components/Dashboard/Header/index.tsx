import Link from "next/link";
import styles from "./styles.module.scss";

type Props = {
  backUrl?: string;
  children: React.ReactNode;
};

const DashboardHeader: React.FC<Props> = ({ children, backUrl }) => {
  return (
    <header className={styles.header}>
      <Link href={backUrl || "javascript:history.back()"}>
        <span>&lt;</span>
      </Link>
      {children}
    </header>
  );
};

export default DashboardHeader;
