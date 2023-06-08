import classNames from 'classnames';
import { observer } from 'mobx-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { z } from 'zod';

import DashboardLayout from 'components/Dashboard/Layout';
import ModalWrapper from 'components/ModalWrapper';
import { LogOutIcon, UserIcon } from 'components/ui/Icons';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import parentStore from 'stores/ParentStore';
import dayMap from 'utils/dayMap';
import deleteEmptyParams from 'utils/deleteEmptyParams';
import { toRubles } from 'utils/localisation';
import { getFullName } from 'utils/names';
import idSchema from 'utils/schemas/idSchema';
import { trpc } from 'utils/trpc/client';

import styles from './styles.module.scss';

const paramSchema = z.object({
  student: idSchema.default(0),
});

function ParentPage() {
  const session = useSession({ required: true });
  const router = useRouter();
  const { student } = paramSchema.parse(router.query);

  const parentId = idSchema.optional().parse(session.data?.user.id);

  const { data: parent, ...parentQuery } = trpc.parents.getById.useQuery(
    { id: parentId ?? NaN },
    {
      onError() {
        toast.error('Не удалость получить информацию о родителе');
      },
      enabled: parentId !== undefined,
      staleTime: Infinity,
    },
  );

  // const { data: parent, ...parentQuery } = useQuery(getParent(parentId));

  const selectedChild = parent?.children[student];

  const { data: totalCosts, ...totalCostQuery } = trpc.preferences.totalCost.useQuery(
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
          <span>Стоимость питания за неделю: {totalCosts && toRubles(totalCosts.total)}</span>
          <span>Текущая задолженность: {selectedChild && toRubles(selectedChild.debt)}</span>
        </div>
      </header>
      <main className={styles.daySelect}>
        {dayMap.slice(0, 5).map((day, i) => (
          <Link href={selectedChild ? `/dashboard/${selectedChild.id}?day=${i}` : ''} key={i}>
            <div className={styles.daySelect_dayOfTheWeek}>
              <span>{day}</span>
              {/* <span>{data && data[i]}</span> */}
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
              router.replace(
                { pathname: '', query: deleteEmptyParams({ ...router.query, student: idx }) },
                undefined,
                {
                  shallow: true,
                },
              );
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
