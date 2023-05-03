import { PropsWithChildren, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import styles from './styles.module.scss';

type Props = PropsWithChildren<{
  toggle?: () => void;
  provideContainer?: boolean;
}>;

export default function ModalWrapper({ children, toggle, provideContainer = false }: Props) {
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
      {provideContainer && <div className={styles.container}>{children}</div>}
      {!provideContainer && children}
    </div>,
    document.querySelector('#__next') as HTMLElement,
  );
}
