import classNames from 'classnames';
import { ButtonHTMLAttributes, FC } from 'react';

import styles from './styles.module.scss';

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
  <button className={classNames(styles.button, className)} type="button" {...props}>
    {children}
  </button>
);

export default Button;
