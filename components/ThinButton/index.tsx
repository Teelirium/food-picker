import classNames from 'classnames';
import { MouseEventHandler, PropsWithChildren } from 'react';

import styles from './styles.module.scss';

type Props = PropsWithChildren<{
  onClick?: MouseEventHandler<HTMLElement>;
}>;

export default function ThinButton({ onClick, children }: Props) {
  if (onClick) {
    return (
      <button
        className={classNames(styles.container, styles.clickable)}
        onClick={onClick}
        type="button"
      >
        {children}
      </button>
    );
  }
  return <div className={styles.container}>{children}</div>;
}
