import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { z } from 'zod';

import DashboardLayout from 'components/Dashboard/Layout';
import ModalWrapper from 'components/ModalWrapper';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import menuIcon from 'public/svg/menu.svg';
import parentStore from 'stores/ParentStore';
import dayMap from 'utils/dayMap';
import getFullName from 'utils/getFullName';
import { getParent } from 'utils/queries/parent';
import idSchema from 'utils/schemas/idSchema';

import Modal from './Modal';
import styles from './styles.module.scss';

const paramSchema = z.object({
  student: idSchema.optional(),
});

function ParentPage() {
  const session = useSession();
  const router = useRouter();

  const { student } = paramSchema.parse(router.query);
  const parentId = idSchema.optional().parse(session.data?.user.id);

  const { data: parent, ...parentQuery } = useQuery(getParent(parentId));

  const toggleModal = () => {
    router.replace('', undefined, { shallow: true });
  };

  return (
    <DashboardLayout>
      <div className={styles.header}>
        <Link href={`?student=${parentStore.childIndex}`} shallow replace>
          <button className={styles.menuButton} type="button">
            <Image src={menuIcon} alt="menu" width={30} height={30} />
          </button>
        </Link>
        <div className={styles.daySelect_childName}>
          {parent ? getFullName(parent.children[parentStore.childIndex]) : ''}
        </div>
      </div>
      <div className={styles.daySelect_daysContainer}>
        {dayMap.slice(0, 5).map((day, i) => (
          <Link
            href={parent ? `/dashboard/${parent.children[parentStore.childIndex].id}?day=${i}` : ''}
            key={i}
          >
            <div className={styles.daySelect_dayOfTheWeek}>
              <span>{day}</span>
            </div>
          </Link>
        ))}
      </div>
      {student !== undefined && <Modal toggle={toggleModal} />}
      {parentQuery.isLoading && (
        <ModalWrapper provideContainer>
          <LoadingSpinner />
        </ModalWrapper>
      )}
    </DashboardLayout>
  );
}

export default observer(ParentPage);
