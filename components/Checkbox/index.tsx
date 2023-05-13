import classNames from 'classnames';
import { ForwardedRef, InputHTMLAttributes, forwardRef } from 'react';

import styles from './Checkbox.module.scss';

const Checkbox = (
  { children, className, ...props }: InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>,
) => (
  <label className={classNames(styles.wrapper, className)}>
    <input className={styles.input} type="checkbox" ref={ref} {...props} />
    <span className={classNames(styles.checkbox, 'checkbox__inner')} />
    {children && <p className={classNames(styles.text, 'checkbox__text')}>{children}</p>}
  </label>
);

const CheckboxWithRef = forwardRef(Checkbox);

export default CheckboxWithRef;
