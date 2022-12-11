import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import parentStore from "stores/ParentStore";
import styles from "./styles.module.css";
import Modal from "./Modal";
import { useSession } from "next-auth/react";
import getFullName from "utils/getFullName";
import Link from "next/link";
import dayMap from "utils/dayMap";
import DashboardLayout from "components/Dashboard/Layout";
import { z } from "zod";
import { useRouter } from "next/router";

const queryValidator = z.object({
  student: z
    .preprocess((i) => Number(z.string().parse(i)), z.number().min(0))
    .optional(),
});

const Parent = () => {
  const session = useSession();
  const router = useRouter();

  const { student } = useMemo(
    () => queryValidator.parse(router.query),
    [router.query]
  );

  useEffect(() => {
    if (session.data) {
      parentStore.fetchParent(+session.data.user.id);
    }
  }, [session]);

  //const [isModalOpen, setModalOpen] = useState(false);

  return (
    <DashboardLayout>
      {!!parentStore.parent ? (
        <>
          <div className={styles.header}>
            <Link href={`?student=0`} shallow={true}>
              <div className={styles.daySelect_menuButton}></div>
            </Link>
            <div className={styles.daySelect_childName}>
              {parentStore.currentChild
                ? getFullName(parentStore.currentChild)
                : null}
            </div>
          </div>
          <div className={styles.daySelect_daysContainer}>
            {dayMap.slice(0, 5).map((day, i) => (
              <Link
                href={`/dashboard/${parentStore.currentChild?.id}?day=${i}`}
                key={i}
              >
                <div className={styles.daySelect_dayOfTheWeek}>
                  <span>{day.toUpperCase()}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
        <Modal isOpen={student !== undefined} />
    </DashboardLayout>
  );
};

export default observer(Parent);
