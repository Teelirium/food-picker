import classNames from 'classnames';
import { PropsWithChildren } from 'react';
import { ToastType } from 'react-hot-toast';

import { XCircleIcon } from 'components/ui/Icons';

import styles from './styles.module.scss';

type Props = PropsWithChildren<{
  visible: boolean;
  type: ToastType;
  onClick: () => void;
  duration?: number;
}>;

export default function Notification({ children, visible, type, onClick, duration }: Props) {
  return (
    <div
      className={classNames(
        styles.container,
        type === 'error' && styles.error,
        visible ? styles.appear : styles.disappear,
      )}
      onClick={onClick}
    >
      <button className={styles.x} type="button">
        <XCircleIcon />
      </button>

      {children}
      {duration !== undefined && duration !== Infinity && (
        <div className={styles.progress} style={{ animationDuration: `${duration}ms` }} />
      )}
    </div>
  );
}
