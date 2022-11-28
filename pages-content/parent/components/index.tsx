import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import parentStore from "../../../stores/ParentStore";
import styles from "../../../styles/parent.module.css";
import Modal from "./modal";

const Parent = () => {
  useEffect(() => {
    parentStore.fetchParent();
  }, []);

  const [isModalOpen, setModalOpen] = useState(false);

  if (!parentStore.parent) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={styles.daySelect_container}>
        <div className={styles.daySelect_innerContainer}>
          <div className={styles.daySelect_header}>
            <div
              className={styles.daySelect_menuButton}
              onClick={() => setModalOpen(!isModalOpen)}
            ></div>
            <div className={styles.daySelect_childName}>
              {parentStore.selectedChild}
            </div>
          </div>
          <div className={styles.daySelect_daysContainer}>
            <div className={styles.daySelect_dayOfTheWeek}>
              <span>ПОНЕДЕЛЬНИК</span>
            </div>
            <div className={styles.daySelect_dayOfTheWeek}>
              <span>ВТОРНИК</span>
            </div>
            <div className={styles.daySelect_dayOfTheWeek}>
              <span>СРЕДА</span>
            </div>
            <div className={styles.daySelect_dayOfTheWeek}>
              <span>ЧЕТВЕРГ</span>
            </div>
            <div className={styles.daySelect_dayOfTheWeek}>
              <span>ПЯТНИЦА</span>
            </div>
            <div className={styles.daySelect_dayOfTheWeek}>
              <span>СУББОТА</span>
            </div>
          </div>
        </div>
      </div>

      <Modal isModalOpen={isModalOpen} />
    </>
  );
};

export default observer(Parent);
