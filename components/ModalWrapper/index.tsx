import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import styles from './styles.module.scss';

type Props = {
  children: React.ReactNode;
  toggle: () => void;
};

const ModalWrapper: React.FC<Props> = ({ children, toggle }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className={styles.wrapper}>
      <div className={styles.bg} onClick={toggle} />
      {children}
    </div>,
    document.querySelector('#__next') as HTMLElement,
  );
};

export default ModalWrapper;
