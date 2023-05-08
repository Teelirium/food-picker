import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react';
import { signOut, useSession } from 'next-auth/react';

import ModalWrapper from 'components/ModalWrapper';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import parentStore from 'stores/ParentStore';
import getFullName from 'utils/getFullName';
import { getParent } from 'utils/queries/parent';
import idSchema from 'utils/schemas/idSchema';

import styles from './styles.module.scss';

const Modal = ({ toggle }: { toggle: () => void }) => {
  const session = useSession();
  const parentId = idSchema.optional().parse(session.data?.user.id);

  const { data: parent, ...parentQuery } = useQuery(getParent(parentId));

  if (!parent)
    return (
      <ModalWrapper provideContainer>
        <LoadingSpinner />
      </ModalWrapper>
    );

  const childList = parent.children.map((child, index) => (
    <div
      key={child.id}
      onClick={() => {
        parentStore.setChildIndex(index);
      }}
      className={parentStore.childIndex === index ? styles.activeChildname : styles.childname}
    >
      <span>{getFullName(child)}</span>
    </div>
  ));

  return (
    <ModalWrapper toggle={toggle}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Добро пожаловать, {getFullName(parent)}</h2>
        </div>
        <h3 className={styles.subHeader}>Выбор еды для:</h3>
        <div className={styles.body}>
          <div className={styles.list}>{childList}</div>
          <button className={styles.logOutBtn} onClick={() => signOut()} type="button">
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default observer(Modal);
