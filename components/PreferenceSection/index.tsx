import React from "react";
import styles from "./styles.module.scss";

type Props = {
  title: string;
  children: React.ReactNode;
};

const PreferenceSection: React.FC<Props> = ({ title, children }) => {
  return (
    <div className={styles.container}>
      <span>{title}</span>
      <div className={styles.body}>{children}</div>
    </div>
  );
};

export default PreferenceSection;
