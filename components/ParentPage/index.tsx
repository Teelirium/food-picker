import { observer } from 'mobx-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { z } from 'zod';

import DashboardLayout from 'components/Dashboard/Layout';
import menuIcon from 'public/svg/menu.svg';
import parentStore from 'stores/ParentStore';
import dayMap from 'utils/dayMap';
import getFullName from 'utils/getFullName';

import Modal from './Modal';
import styles from './styles.module.scss';

const paramSchema = z.object({
  student: z.preprocess((i) => Number(z.string().parse(i)), z.number().min(0)).optional(),
});

const ParentPage = () => {
  const session = useSession();
  const router = useRouter();

  const { student } = paramSchema.parse(router.query);

  const toggleModal = () => {
    router.replace('', undefined, { shallow: true });
  };

  useEffect(() => {
    if (session.data) {
      parentStore.fetchParent(+session.data.user.id);
    }
  }, [session.data]);

  return (
    <DashboardLayout>
      {parentStore.parent ? (
        <>
          <div className={styles.header}>
            <Link href={`?student=${parentStore.childIndex}`} shallow replace>
              <div className={styles.menuButton}>
                <Image src={menuIcon} alt="menu" width={30} height={30} />
              </div>
            </Link>
            <div className={styles.daySelect_childName}>
              {parentStore.currentChild ? getFullName(parentStore.currentChild) : null}
            </div>
          </div>
          <div className={styles.daySelect_daysContainer}>
            {dayMap.slice(0, 5).map((day, i) => (
              <Link href={`/dashboard/${parentStore.currentChild?.id}?day=${i}`} key={i}>
                <div className={styles.daySelect_dayOfTheWeek}>
                  <span>{day.toUpperCase()}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div>Загрузка...</div>
      )}
      {student !== undefined && <Modal toggle={toggleModal} />}
    </DashboardLayout>
  );
};

export default observer(ParentPage);
