import classNames from 'classnames';
import { FC, InputHTMLAttributes } from 'react';

import styles from './Checkbox.module.scss';

const Checkbox: FC<InputHTMLAttributes<HTMLInputElement>> = ({ children, className, ...props }) => (
  <label className={classNames(styles.wrapper, className)}>
    <input className={styles.input} type="checkbox" {...props} />
    <span className={styles.checkbox} />
    {children && <p className={styles.text}>{children}</p>}
  </label>
);

export default Checkbox;
