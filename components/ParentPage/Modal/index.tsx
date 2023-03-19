import { observer } from 'mobx-react';
import { signOut } from 'next-auth/react';

import ModalWrapper from 'components/ModalWrapper';
import parentStore from 'stores/ParentStore';
import getFullName from 'utils/getFullName';

import styles from './styles.module.scss';

const Modal = ({ toggle }: { toggle: () => void }) => {
  if (!parentStore.parent) {
    return null;
  }

  const childList = parentStore.parent.children.map((child, index) => (
    <div
      key={child.id}
      onClick={() => {
        parentStore.setChild(index);
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
          <h2>Добро пожаловать, {getFullName(parentStore.parent)}</h2>
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
