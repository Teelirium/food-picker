import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';

import parentStore from 'stores/ParentStore';
import getFullName from 'utils/getFullName';

import styles from './styles.module.scss';

const Modal = ({ isOpen }: { isOpen: boolean }) => {
  const router = useRouter();
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

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

  return ReactDOM.createPortal(
    <div
      className={isOpen ? styles.active : styles.inactive}
      onClick={() => router.push('', undefined, { shallow: true })}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          {/* <span>Добро пожаловать,</span> */}
          <h2>{getFullName(parentStore.parent)}</h2>
        </div>
        <h3 className={styles.subHeader}>Выбор еды для:</h3>
        <div className={styles.body}>
          <div className={styles.list}>{childList}</div>
          <button className={styles.logOutBtn} onClick={() => signOut()} type="button">
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>,
    document.querySelector('#__next') as HTMLElement,
  );
};

export default Modal;
