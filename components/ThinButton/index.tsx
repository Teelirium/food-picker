import classNames from 'classnames';
import React, { ButtonHTMLAttributes } from 'react';

import styles from './styles.module.scss';

export default function ThinButton({
  asDiv = false,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { asDiv?: boolean }) {
  if (!asDiv) {
    return (
      <button className={classNames(styles.container, styles.clickable)} type="button" {...rest}>
        {children}
      </button>
    );
  }
  return (
    <div className={styles.container} {...(rest as React.HTMLAttributes<HTMLDivElement>)}>
      {children}
    </div>
  );
}
