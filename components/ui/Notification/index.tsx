import classNames from 'classnames';
import { PropsWithChildren } from 'react';

import { XCircleIcon } from '../Icons';

import styles from './styles.module.scss';

type Props = PropsWithChildren<{
  visible: boolean;
  onClick: () => void;
  duration?: number;
}>;

export default function Notification({ children, visible, onClick, duration }: Props) {
  return (
    <div
      className={classNames(styles.container, visible ? styles.appear : styles.disappear)}
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
