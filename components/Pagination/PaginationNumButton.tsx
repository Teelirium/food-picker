import classnames from 'classnames';
import { ButtonHTMLAttributes, FC } from 'react';

import style from './Pagination.module.scss';

interface PaginationNumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  page: number;
  current: number;
  goTo: (page: number) => void;
}

const PaginationNumButton: FC<PaginationNumButtonProps> = ({ page, current, goTo, ...props }) => {
  const onClick = () => goTo(page);

  return (
    <button
      type="button"
      className={classnames(style.pageButton, current === page && style.pageButtonCurrent)}
      onClick={onClick}
      {...props}
    >
      {page}
    </button>
  );
};

export default PaginationNumButton;
