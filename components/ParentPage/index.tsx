import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

import DashboardLayout from 'components/Dashboard/Layout';
import ModalWrapper from 'components/ModalWrapper';
import { LogOutIcon, UserIcon } from 'components/ui/Icons';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import parentStore from 'stores/ParentStore';
import dayMap from 'utils/dayMap';
import { toRubles } from 'utils/localisation';
import { getFullName } from 'utils/names';
import { getParent } from 'utils/queries/parent';
import idSchema from 'utils/schemas/idSchema';
import { trpc } from 'utils/trpc/client';

import styles from './styles.module.scss';

function ParentPage() {
  const session = useSession();

  const parentId = idSchema.optional().parse(session.data?.user.id);
  const { data: parent, ...parentQuery } = useQuery(getParent(parentId));

  const selectedChild = parent?.children[parentStore.childIndex];

  const { data, ...totalCostQuery } = trpc.preferences.totalCost.useQuery(
    { studentId: selectedChild?.id ?? NaN },
    { enabled: selectedChild !== undefined, staleTime: Infinity },
  );

  const showSpinner = parentQuery.isFetching || totalCostQuery.isFetching;

  return (
    <DashboardLayout>
      <header className={styles.header}>
        <button className={styles.menuButton} onClick={() => signOut()} type="button">
          <LogOutIcon style={{ transform: 'rotate(180deg)' }} />
        </button>
        <h1 className={styles.daySelect_childName}>
          {selectedChild ? getFullName(selectedChild) : ''}
        </h1>
        <div className={styles.headerLabels}>
          <span>Стоимость питания за неделю: {JSON.stringify(data)}</span>
          <span>Текущая задолженность: {selectedChild && toRubles(selectedChild.debt)}</span>
        </div>
      </header>
      <main className={styles.daySelect}>
        {dayMap.slice(0, 5).map((day, i) => (
          <Link href={selectedChild ? `/dashboard/${selectedChild.id}?day=${i}` : ''} key={i}>
            <div className={styles.daySelect_dayOfTheWeek}>
              <span>{day}</span>
            </div>
          </Link>
        ))}
      </main>
      {showSpinner && (
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
