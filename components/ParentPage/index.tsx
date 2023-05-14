import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { z } from 'zod';

import DashboardLayout from 'components/Dashboard/Layout';
import ModalWrapper from 'components/ModalWrapper';
import { HamburgerIcon, LogOutIcon, UserIcon } from 'components/ui/Icons';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import parentStore from 'stores/ParentStore';
import dayMap from 'utils/dayMap';
import { getFullName, getInitials } from 'utils/names';
import { getParent } from 'utils/queries/parent';
import idSchema from 'utils/schemas/idSchema';

import Modal from './Modal';
import styles from './styles.module.scss';

const paramSchema = z.object({
  student: idSchema.default(0),
});

function ParentPage() {
  const session = useSession();
  const router = useRouter();

  const parentId = idSchema.optional().parse(session.data?.user.id);

  const { data: parent, ...parentQuery } = useQuery(getParent(parentId));

  const toggleModal = () => {
    router.replace('', undefined, { shallow: true });
  };

  return (
    <DashboardLayout>
      <header className={styles.header}>
        <button className={styles.menuButton} onClick={() => signOut()} type="button">
          <LogOutIcon style={{ transform: 'rotate(180deg)' }} />
        </button>
        <h1 className={styles.daySelect_childName}>
          {parent ? getFullName(parent.children[parentStore.childIndex]) : ''}
        </h1>
      </header>
      <main className={styles.daySelect}>
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
      </main>
      {parentQuery.isLoading && (
        <ModalWrapper provideContainer>
          <LoadingSpinner />
        </ModalWrapper>
      )}
      <footer className={styles.footer}>
        {parent?.children.map((child, idx) => (
          <button
            className={styles.footerItem}
            key={child.id}
            type="button"
            onClick={() => {
              parentStore.setChildIndex(idx);
            }}
          >
            <div
              className={classNames(
                styles.footerItemIcon,
                idx === parentStore.childIndex ? styles.footerItemIconActive : null,
              )}
            >
              <UserIcon />
            </div>
            <span>{child.name}</span>
          </button>
        ))}
        {/* Для тестирования */}
        {/* <button className={styles.footerItem} type="button">
          <div className={styles.footerItemIcon}>
            <UserIcon />
          </div>
          <span className={styles.footerItemText}>Братислав</span>
        </button> */}
      </footer>
    </DashboardLayout>
  );
}

export default observer(ParentPage);
