import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import parentStore from "stores/ParentStore";
import styles from "./styles.module.css";
import Modal from "./Modal";
import { useSession } from "next-auth/react";
import getFullName from "utils/getFullName";
import Link from "next/link";

const Parent = () => {
  const session = useSession();

  useEffect(() => {
    if (session.data) {
      parentStore.fetchParent(+session.data.user.id);
    }
  }, [session]);

  const [isModalOpen, setModalOpen] = useState(false);

  if (!parentStore.parent) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div
            className={styles.daySelect_menuButton}
            onClick={() => setModalOpen(!isModalOpen)}
          ></div>
          <div className={styles.daySelect_childName}>
            {parentStore.currentChild
              ? getFullName(parentStore.currentChild)
              : null}
          </div>
        </div>
        <div className={styles.daySelect_daysContainer}>
          <Link href={`/dashboard/${parentStore.currentChild?.id}?day=${0}`}>
            <div className={styles.daySelect_dayOfTheWeek}>
              <span>ПОНЕДЕЛЬНИК</span>
            </div>
          </Link>
          <Link href={`/dashboard/${parentStore.currentChild?.id}?day=${1}`}>
            <div className={styles.daySelect_dayOfTheWeek}>
              <span>ВТОРНИК</span>
            </div>
          </Link>
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
      <Modal isModalOpen={isModalOpen} />
    </>
  );
};

export default observer(Parent);
