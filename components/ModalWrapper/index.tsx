import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import styles from './styles.module.scss';

type Props = {
  children: React.ReactNode;
  toggle: () => void;
};

const ModalWrapper: React.FC<Props> = ({ children, toggle }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return createPortal(
    <div className={styles.wrapper}>
      <div className={styles.bg} onClick={toggle} />
      {children}
    </div>,
    document.querySelector('#__next') as HTMLElement,
  );
};

export default ModalWrapper;
