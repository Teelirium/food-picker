import styles from "./styles.module.scss";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className={styles.bg}>
      <div className={styles.container}>{children}</div>
    </div>
  );
};

export default DashboardLayout;
