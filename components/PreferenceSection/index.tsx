import { Dish } from "@prisma/client";
import DishCardSmall from "components/DishCardSmall";
import React, { MouseEventHandler } from "react";
import styles from "./styles.module.scss";

type Props = {
  title: string;
  children?: React.ReactNode;
  dish?: Dish;
  handleView?: MouseEventHandler<HTMLElement>;
  handleDelete?: MouseEventHandler<HTMLElement>;
};

const PreferenceSection: React.FC<Props> = ({
  title,
  children,
  dish,
  handleView,
  handleDelete,
}) => {
  return (
    <div className={styles.container}>
      <span>{title}</span>
      <div className={styles.body}>
        {!!dish ? (
          <>
            <div onClick={handleView} style={{ width: "100%" }}>
              <DishCardSmall dish={dish} />
            </div>
            <div className={styles.btnGroup}>

            </div>
          </>
        ) : (
          "+ Добавить Блюдо"
        )}
      </div>
    </div>
  );
};

export default PreferenceSection;
