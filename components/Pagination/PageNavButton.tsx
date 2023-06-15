import { ButtonHTMLAttributes, FC } from 'react';

import style from './Pagination.module.scss';

const PageNavButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ ...props }) => (
  <button type="button" className={style.navButton} {...props} />
);

export default PageNavButton;
